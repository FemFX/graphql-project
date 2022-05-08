import {
  Query,
  Resolver,
  Args,
  Int,
  Mutation,
  InputType,
  Field,
  Context,
  ResolveField,
  Info,
} from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { isAuth } from "src/middlewares/isAuth";
import { MyContext } from "src/types";
import { User } from "src/user/user.entity";
import { getConnection, Repository } from "typeorm";
import { Post } from "./post.entity";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@Resolver()
export class PostResolver {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>
  ) {}

  @Query(() => [Post])
  async posts(
    @Args("limit", { type: () => Int, nullable: false }) limit: number,
    @Args("offset", { type: () => Int, nullable: true }) offset: number | null,
    @Info() info: any
  ): Promise<Post[]> {
    const realLimit = Math.max(15, limit);
    console.log(info);
    return this.postRepository
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.creator", "creator")
      .orderBy("p.created_at", "DESC")
      .take(limit)
      .skip(offset)
      .getMany();
  }
  @Query(() => Post, { nullable: true })
  async post(
    @Args("id", { type: () => Int }) id: number
  ): Promise<Post | null> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ["creator"],
    });
    return post;
  }
  @Mutation(() => Post)
  async createPost(
    @Args("input", { type: () => PostInput }) input: PostInput,
    @Context() { req }: MyContext
  ): Promise<Post> {
    if (!req.session.userId) {
      throw new Error("not authenticated");
    }
    const newPost = await this.postRepository.create({
      ...input,
      creatorId: req.session.userId,
    });
    await this.postRepository.save(newPost);
    return newPost;
  }
  @Mutation(() => String)
  async deletePost(
    @Args("id", { type: () => Int }) id: number
  ): Promise<boolean> {
    try {
      const post = await this.postRepository.delete(id);
      return true;
    } catch (error) {
      return false;
    }
  }
  @Mutation(() => Post)
  async updatePost(
    @Args("id", { type: () => Int }) id: number,
    @Args("title", { type: () => String }) title: string
  ): Promise<Post | null> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await this.postRepository.save(post);
    }

    return post;
  }
}
