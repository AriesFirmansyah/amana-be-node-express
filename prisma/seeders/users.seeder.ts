import env from "@config/env";
import { PrismaClient, Role } from "@prisma/client";
import { EncryptionUtil } from "@utils/encryption.util";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const userSeeder = async () => {
  try {
    const defaultPassword = EncryptionUtil.AESencrypt(
      "Password123!",
      env.encryption.secretKey!,
    );

    const testUsers = [
      {
        email: "admin@amana.id",
        name: "Amana Administrator",
        password: defaultPassword,
        role: Role.ADMIN,
        is_email_verified: true,
        slug: "amana-administrator",
      },
      {
        email: "reporter@amana.id",
        name: "Budi Santoso (Reporter)",
        password: defaultPassword,
        role: Role.REPORTER,
        is_email_verified: true,
        slug: "budi-santoso-reporter",
      },
      {
        email: "siti@amana.id",
        name: "Siti Aminah (Reporter)",
        password: defaultPassword,
        role: Role.REPORTER,
        is_email_verified: true,
        slug: "siti-aminah-reporter",
      },
    ];

    for (const u of testUsers) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {
          name: u.name,
          password: u.password,
          role: u.role,
          is_email_verified: u.is_email_verified,
          deletedAt: null,
        },
        create: u,
      });
    }

    console.log("Seeding test users completed successfully!");
  } catch (err: any) {
    console.error("seeding user error", err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};
