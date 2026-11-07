import jwt from "jsonwebtoken";
import moment from "moment";
import { Token, TokenType } from "@prisma/client";

import {
  GenerateAuthTokensProps,
  GenerateTokenProps,
  SaveTokenProps,
} from "./types";
import env from "@config/env";
import repository from "@repository/index";

const generateToken = (props: GenerateTokenProps): string => {
  const { user, expires, secret = env.auth.accessToken || "" } = props;

  const payload = {
    sub: user.email,
    role: user.role,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (props: SaveTokenProps): Promise<Token> => {
  const { token, userId, expires, type, blacklisted = false } = props;

  const createdToken = await repository.token.create({
    data: {
      token,
      expires: expires.toDate(),
      type,
      blacklisted,
      user: {
        connect: {
          id: Number(userId),
        },
      },
    },
  });
  return createdToken;
};

const generateAuthTokens = async (props: GenerateAuthTokensProps) => {
  const { user } = props;

  const accessTokenExpires = moment().add(
    env.auth.accessExpirationMinutes,
    "minutes",
  );
  const accessToken = generateToken({
    user,
    expires: accessTokenExpires,
    type: TokenType.ACCESS,
  });

  const refreshTokenExpires = moment().add(
    env.auth.accessExpirationDays,
    "days",
  );

  const refreshToken = generateToken({
    user,
    expires: refreshTokenExpires,
    type: TokenType.REFRESH,
  });
  await saveToken({
    token: refreshToken,
    userId: String(user.id),
    expires: refreshTokenExpires,
    type: TokenType.REFRESH,
  });

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const tokenService = {
  saveToken,
  generateToken,
  generateAuthTokens,
};

export default tokenService;
