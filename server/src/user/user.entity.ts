import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Post } from "src/post/post.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity("users")
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ unique: true })
  username: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Field(() => String)
  @Column()
  password: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

}
