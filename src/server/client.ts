import env from "@config/env";
import { Prisma, PrismaClient } from "@prisma/client";

interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

const prismaClient: PrismaClient = global.prisma || new PrismaClient();

if (env.appEnv === "development") global.prisma = prismaClient;

prismaClient.$use(async (params: Prisma.MiddlewareParams, next) => {
  const deletedType = ["delete", "deleteMany"];
  const exeptionType = [
    "create",
    "createMany",
    "update",
    "updateMany",
    "upsert",
  ];
  const findSingleType = ["findFirst", "findUnique"];

  if (!exeptionType.includes(params.action)) {
    if (deletedType.includes(params.action)) {
      const currentTime = new Date();
      if (params.action == "delete") {
        params.action = "update";
        params.args["data"] = { deletedAt: currentTime };
      } else if (params.action == "deleteMany") {
        params.action = "updateMany";
        if (params.args.data != undefined) {
          params.args.data["deletedAt"] = currentTime;
        } else {
          params.args["data"] = { deletedAt: currentTime };
        }
      }
    } else {
      if (findSingleType.includes(params.action)) {
        params.action = "findFirst";
      }
      if (params.args.where) {
        if (params.args.where.deletedAt == undefined) {
          params.args.where["deletedAt"] = undefined;
        }
      } else {
        params.args["where"] = { deletedAt: undefined };
      }
    }
  }

  return next(params);
});

const prisma = prismaClient;

export default prisma;
