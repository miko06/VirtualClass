import "dotenv/config";
import * as bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Resetting admin password...");
    const adminPassword = await bcrypt.hash("Admin123!", 10);

    const admin = await prisma.user.update({
        where: { email: "admin@enu.kz" },
        data: { password: adminPassword }
    });

    console.log("Password reset successfully for:", admin.email);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
