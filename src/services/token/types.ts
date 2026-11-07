import { TokenType, User } from "@prisma/client";
import { Moment } from "moment";

export type GenerateTokenProps = {
  expires: Moment;
  type: TokenType;
  secret?: string;
  user: Partial<User>;
};

export type SaveTokenProps = {
  token: string;
  userId: string;
  expires: Moment;
  type: TokenType;
  blacklisted?: boolean;
};

export type GenerateAuthTokensProps = {
  user: Partial<User>;
};
