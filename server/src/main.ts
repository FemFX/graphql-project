import { NestFactory } from "@nestjs/core";
import { AppModule, redis } from "./app.module";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import * as Redis from "ioredis";
import * as cors from "cors";
import { sendEmail } from "./utils/sendEmail";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const RedisStore = connectRedis(session);
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      name: "qid",
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10years
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      },
    })
  );
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
