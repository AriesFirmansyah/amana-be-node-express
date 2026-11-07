import logger from "@config/logger";
import { Server } from "http";

import prisma from "./client";
import env from "@config/env";

const exitHandler = (server: Server) => {
  logger.info("Closing server...");
  if (server) {
    server.close((err) => {
      logger.info("Server closed");
      if (err) {
        process.exit(81);
      }
      process.exit();
    });
  }
  process.exit(1);
};

const prismaConnect = async () => {
  try {
    logger.info("💎 Connecting to prisma database server...");
    await prisma.$connect();
    logger.info("💎 Prisma database connected.");
  } catch (err) {
    logger.error("💎 Prisma database connection failed.", err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

const connect = async (server: Server) => {
  const { host, port } = env.api;

  await prismaConnect();

  logger.info("🚚 Starting server...");

  server.listen({ host, port }, () => {
    logger.info(`✅ Server running on port ${port} at ${host}`);
  });

  process.on("SIGINT", async () => {
    logger.info("SIGINT received.");
    await prisma.$disconnect();
    exitHandler(server);
  });

  process.on("SIGTERM", async () => {
    logger.info("SIGTERM received.");
    await prisma.$disconnect();
    exitHandler(server);
  });

  process.on("uncaughtException", async (err) => {
    logger.error("Uncaught Exception:", err);
    await prisma.$disconnect();
    exitHandler(server);
  });

  process.on("unhandledRejection", async (err) => {
    logger.error("Unhandled Rejection:", err);
    await prisma.$disconnect();
    exitHandler(server);
  });
};

export default connect;
