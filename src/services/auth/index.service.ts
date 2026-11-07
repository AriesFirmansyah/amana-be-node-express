import { TokenType, User } from "@prisma/client";
import bcrypt from "bcrypt";

import { EncryptionUtil } from "@utils/encryption.util";
import ApiError from "@utils/ApiError.util";
import { ERROR_MESSAGES } from "@utils/errorMessages.util";

import _, { isEqual } from "lodash";
import env from "@config/env";
import repository from "@repository/index";
import httpStatus from "http-status";

export const decryptIfEncrypted = (
  value: string,
  secretKey: string,
): string => {
  try {
    if (value) {
      return EncryptionUtil.AESdecrypt(value, secretKey);
    }
  } catch (_e) {
    // Fallback to plain value
  }
  return value;
};

export const verifyPassword = async (
  inputPassword: string,
  storedPassword: string,
  secretKey: string,
): Promise<boolean> => {
  const plainInput = decryptIfEncrypted(inputPassword, secretKey);

  // 2. Fallback: Check if storedPassword is AES encrypted
  const plainStored = decryptIfEncrypted(storedPassword, secretKey);
  return isEqual(plainInput, plainStored);
};

type LoginUserWithEmailAndPasswordProps = {
  email: string;
  password: string;
  keys?: (keyof User)[];
};

const loginUserWithEmailAndPassword = async <Key extends keyof User>(
  props: LoginUserWithEmailAndPasswordProps,
): Promise<Omit<Pick<User, Key>, "password">> => {
  const {
    email,
    password,
    keys = ["id", "email", "name", "password", "role", "is_email_verified"],
  } = props;

  const options = {
    select: keys.reduce((obj, curr) => ({ ...obj, [curr]: true }), {}),
  };

  const user = await repository.user.findUnique({ where: { email }, options });

  if (!user)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      ERROR_MESSAGES.AUTH_USER_NOT_FOUND,
    );

  const isPasswordMatch = await verifyPassword(
    password,
    user.password || "",
    env.encryption.secretKey!,
  );

  if (!isPasswordMatch)
    throw new ApiError(httpStatus.BAD_REQUEST, ERROR_MESSAGES.INCORRECT_AUTH);

  return _.omit(user, ["password"]) as Promise<
    Omit<Pick<User, Key>, "password">
  >;
};

type LogoutProps = {
  refreshToken?: string;
  userId?: number;
};

const logout = async (props: LogoutProps): Promise<void> => {
  const { refreshToken, userId } = props;

  if (refreshToken) {
    const refreshTokenData = await repository.token.findFirst({
      where: {
        token: refreshToken,
        type: TokenType.REFRESH,
        blacklisted: false,
      },
    });
    if (refreshTokenData) {
      await repository.token.remove({ where: { id: refreshTokenData.id } });
    }
  } else if (userId) {
    await repository.token.removeMany({
      where: { user_id: Number(userId) },
    });
  }
};

const authService = {
  logout,
  loginUserWithEmailAndPassword,
};
export default authService;
