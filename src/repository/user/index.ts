import { Prisma, PrismaPromise, User } from "@prisma/client";
import {
  CountProps,
  CreateProps,
  DeleteManyProps,
  DeleteProps,
  FindFirstProps,
  FindManyProps,
  FindUniqueProps,
  UpdateManyProps,
  UpdateUniqueProps,
} from "./types";
import prisma from "@server/client";

const create = async (props: CreateProps): Promise<User> => {
  const { data, options } = props;
  const [created] = await prisma.$transaction([
    prisma.user.create({ data, ...options }) as PrismaPromise<User>,
  ]);
  return created;
};

const findMany = (props: FindManyProps): Promise<Partial<User[]>> => {
  const { where, options } = props;
  return prisma.user.findMany({ where, ...options });
};

const findUnique = async (
  props: FindUniqueProps,
): Promise<Partial<User | null>> => {
  const { where, options } = props;
  return prisma.user.findUnique({ where, ...options });
};

const findFirst = (props: FindFirstProps): Promise<User | null> => {
  const { where, options } = props;
  return prisma.user.findFirst({ where, ...options });
};

const count = (props: CountProps): Promise<number> => {
  const { where, options } = props;
  return prisma.user.count({ where });
};

const updateUnique = (props: UpdateUniqueProps): Promise<User> => {
  const { where, data, options } = props;

  const updated = prisma.user.update({ where, data, ...options });
  prisma.$transaction([updated as PrismaPromise<User>]);
  return updated;
};

const updateMany = (props: UpdateManyProps): Promise<Prisma.BatchPayload> => {
  const { where, data } = props;
  const updated = prisma.user.updateMany({ data, where });
  prisma.$transaction([updated as PrismaPromise<Prisma.BatchPayload>]);
  return updated;
};

const remove = (props: DeleteProps): Promise<Partial<User>> => {
  const { where, options } = props;
  const deleted = prisma.user.delete({ where, ...options });
  prisma.$transaction([deleted as PrismaPromise<User>]);
  return deleted;
};

const removeMany = (props: DeleteManyProps): Promise<Prisma.BatchPayload> => {
  const { where } = props;
  const deleted = prisma.user.deleteMany({ where });
  prisma.$transaction([deleted as PrismaPromise<Prisma.BatchPayload>]);
  return deleted;
};

const userRepository = {
  count,
  create,
  remove,
  findMany,
  findFirst,
  findUnique,
  removeMany,
  updateMany,
  updateUnique,
};

export default userRepository;
