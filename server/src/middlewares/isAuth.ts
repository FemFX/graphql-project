import { FieldMiddleware } from "@nestjs/graphql";
import { MyContext } from "src/types";

export const isAuth: FieldMiddleware<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("not authenticated");
  }

  return next();
};
