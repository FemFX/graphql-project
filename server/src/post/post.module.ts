import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Post } from "./post.entity";
import { PostResolver } from "./post.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Post,User])],
  providers: [PostResolver],
})
export class PostModule {}
