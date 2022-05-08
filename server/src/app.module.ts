import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import Redis from "ioredis";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Post } from "./post/post.entity";
import { PostModule } from "./post/post.module";
import { User } from "./user/user.entity";
import { UserModule } from "./user/user.module";

export const redis = new Redis(process.env.REDIS_URL);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "project",
      entities: [Post, User],
      logging: true,
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      playground: true,
      context: ({ req, res }) => ({
        req,
        res,
        redis,
      }),
      cors: false,
    }),
    PostModule,
    UserModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
