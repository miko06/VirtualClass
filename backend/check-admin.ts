import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    const admin = await prisma.user.findUnique({
        where: { email: "admin@enu.kz" },
    });
    console.log("Admin found:", admin ? "Yes" : "No");
    if (admin) {
        console.log("ID:", admin.id);
        console.log("Name:", admin.name);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
