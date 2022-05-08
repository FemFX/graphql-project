import { Field, Int, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity("posts")
export class Post {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;
  @Field(() => String)
  @Column()
  title: string;
  @Field(() => String)
  @Column()
  text: string;
  @Field(() => Int)
  @Column({ type: "int", default: 0 })
  points: number;
  @Field()
  @CreateDateColumn()
  created_at: Date;
  @Field()
  @UpdateDateColumn()
  updated_at: Date;
  @Field()
  @Column()
  creatorId: number;
  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;
}
