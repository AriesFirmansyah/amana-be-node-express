import { QueryOptions } from "@repository/user/types";
import { User, Role, Prisma, PrismaPromise } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  CreateUserProps,
  QueryUsersProps,
  QueryUsersResponse,
} from "./types";

import { decryptIfEncrypted } from "../auth/index.service";
import ApiError from "@utils/ApiError.util";
import { ERROR_MESSAGES } from "@utils/errorMessages.util";

import slugify from "slugify";
import repository from "@repository/index";
import httpStatus from "http-status";
import env from "@config/env";
import prisma from "@server/client";

const create = async <Key extends keyof User>(
  props: CreateUserProps,
): Promise<Pick<User, Key> | null> => {
  const {
    data,
    keys = [
      "id",
      "email",
      "name",
      "role",
      "is_email_verified",
      "slug",
    ],
  } = props;

  let hashedPassword: string | null = null;
  if (data.password) {
    const plainPassword = decryptIfEncrypted(
      data.password,
      env.encryption.secretKey!,
    );
    hashedPassword = await bcrypt.hash(plainPassword, 10);
  }

  const body: Partial<Prisma.UserCreateInput> = {
    ...data,
    password: hashedPassword,
    role: data?.role ?? Role.REPORTER,
    slug: slugify(data?.name as string),
  };
  const options = {
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  };

  if (await repository.user.findUnique({ where: { email: data?.email } }))
    throw new ApiError(httpStatus.BAD_REQUEST, ERROR_MESSAGES.USER_EMAIL_EXIST);

  return await repository.user.create({
    data: body as Prisma.UserCreateInput,
    options,
  });
};

const query = async <Key extends keyof User>(
  props: QueryUsersProps,
): Promise<QueryUsersResponse<Key>> => {
  const {
    where,
    options = {},
    keys = [
      "id",
      "email",
      "name",
      "role",
      "is_email_verified",
      "createdAt",
      "updatedAt",
    ],
  } = props;

  const {
    page = 1,
    limit = 15,
    cursor,
    orderBy,
  } = options;

  const queryOptions: QueryOptions = {
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: Math.max(0, (page - 1) * limit),
    take: Number(limit),
    cursor: cursor ? { ...cursor } : undefined,
    orderBy,
  };

  const [dataModel, queryResults] = await prisma.$transaction([
    repository.user.findMany({ where }) as PrismaPromise<Pick<User, Key>[]>,
    repository.user.findMany({ where, options: queryOptions }) as PrismaPromise<
      Pick<User, Key>[]
    >,
  ]);

  return { count: dataModel.length, dataModel, queryResults };
};

const userService = {
  query,
  create,
};

export default userService;
