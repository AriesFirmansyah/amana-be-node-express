import { Prisma, PrismaPromise, Token } from "@prisma/client";
import {
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

const create = async (props: CreateProps): Promise<Token> => {
  const { data, options } = props;

  const [created] = await prisma.$transaction([
    prisma.token.create({ data, ...options }) as PrismaPromise<Token>,
  ]);

  return created;
};

const findMany = (props: FindManyProps): Promise<Partial<Token[]>> => {
  const { where, options } = props;
  return prisma.token.findMany({ where, ...options });
};

const findUnique = (props: FindUniqueProps): Promise<Partial<Token> | null> => {
  const { where, options } = props;
  return prisma.token.findUnique({ where, ...options });
};

const findFirst = (props: FindFirstProps): Promise<Token | null> => {
  const { where, options } = props;
  return prisma.token.findFirst({ where, ...options });
};

const updateUnique = (props: UpdateUniqueProps): Promise<Token> => {
  const { where, data, options } = props;

  const updated = prisma.token.update({ where, data, ...options });
  prisma.$transaction([updated as PrismaPromise<Token>]);
  return updated;
};

const updateMany = (props: UpdateManyProps): Promise<Prisma.BatchPayload> => {
  const { where, data } = props;
  const updated = prisma.token.updateMany({ data, where });
  prisma.$transaction([updated as PrismaPromise<Prisma.BatchPayload>]);
  return updated;
};

const remove = (props: DeleteProps): Promise<Partial<Token>> => {
  const { where, options } = props;
  const deleted = prisma.token.delete({ where, ...options });
  prisma.$transaction([deleted as PrismaPromise<Token>]);
  return deleted;
};

const removeMany = (props: DeleteManyProps): Promise<Prisma.BatchPayload> => {
  const { where } = props;
  const deleted = prisma.token.deleteMany({ where });
  prisma.$transaction([deleted as PrismaPromise<Prisma.BatchPayload>]);
  return deleted;
};

const tokenRepository = {
  create,
  remove,
  findMany,
  findFirst,
  findUnique,
  updateMany,
  removeMany,
  updateUnique,
};

export default tokenRepository;
