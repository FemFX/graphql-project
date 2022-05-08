import {
  Args,
  CONTEXT,
  Context,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  ResolveField,
  Resolver,
  Root,
} from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { MyContext } from "src/types";
import { sendEmail } from "src/utils/sendEmail";
import { v4 } from "uuid";
import * as argon2 from "argon2";

@InputType()
class UsernamePasswordEmailInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}
@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}
  @ResolveField(() => String)
  email(@Root() user: User, @Context() { req }: MyContext) {
    if (req.session.userId === user.id) {
      return user.email;
    }
    return "";
  }
  @Query(() => User, { nullable: true })
  async me(@Context() { req }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    const user = await this.userRepository.findOne({
      where: { id: req.session.userId },
    });
    return user;
  }
  @Mutation(() => User)
  async register(
    @Args("options") options: UsernamePasswordEmailInput
  ): Promise<User> {
    const hashedPass = await argon2.hash(options.password);
    const user = await this.userRepository.create({
      username: options.username,
      email: options.email,
      password: hashedPass,
    });
    this.userRepository.save(user);
    return user;
  }
  @Mutation(() => UserResponse)
  async login(
    @Args("options") options: UsernamePasswordInput,
    @Context() { redis, req }: MyContext
  ): Promise<UserResponse> {
    const user = await this.userRepository.findOneOrFail({
      where: { username: options.username },
    });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "that username doesn't exist",
          },
        ],
        user: null,
      };
    }
    const isValid = await argon2.verify(user.password, options.password);
    console.log(isValid);

    if (!isValid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }
    req.session.userId = user.id;
    return { user };
  }
  @Mutation(() => Boolean)
  logout(@Context() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie("qid");
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
  @Mutation(() => Boolean)
  async forgotPassword(
    @Context() { req, redis }: MyContext,
    @Args("email", { type: () => String }) email: string
  ) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return true;
    }
    const token = v4();
    await redis.set(
      process.env.FORGET_PASSWORD_PREFIX + token,
      user.id,
      "EX",
      1000 * 60 * 60 * 24 * 3 //3days
    );
    console.log(`http://localhost:3000/change-password/${token}`);

    sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}>reset password</a>`
    );
    return true;
  }
  @Mutation(() => UserResponse)
  async changePassword(
    @Args("token") token: string,
    @Args("newPassword") newPassword: string,
    @Context() { redis, req }: MyContext
  ): Promise<UserResponse> {
    const userId = await redis.get(process.env.FORGET_PASSWORD_PREFIX + token);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }
    const user = await this.userRepository.findOne({ where: { id: +userId } });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }
    await this.userRepository.update(
      { id: +userId },
      {
        password: await argon2.hash(newPassword),
      }
    );
    await redis.del(process.env.FORGET_PASSWORD_PREFIX + token);
    req.session.userId = user.id;

    return { user };
  }
}
