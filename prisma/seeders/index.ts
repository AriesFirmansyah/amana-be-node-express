import { PrismaClient } from "@prisma/client";
import { userSeeder } from "./users.seeder";
import { reportSeeder } from "./reports.seeder";

const prisma = new PrismaClient();

const main = async () => {
  await userSeeder();
  await reportSeeder();
};

main()
  .then(() => {
    console.log("All seeders have been executed.");
  })
  .catch((e) => {
    console.error("main seeder error", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
