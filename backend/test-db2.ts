import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
async function main() {
  const d = await prisma.discipline.findMany();
  console.log("DISCIPLINES:", d.map(x => x.name));
  const c = await prisma.class.findMany();
  console.log("CLASSES:", c.map(x => x.name));
}
main().finally(() => prisma.$disconnect());
