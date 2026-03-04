import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const classes = await prisma.class.findMany({ include: { teacher: true } });
  console.log("CLASSES:", classes.map(c => c.name));

  const studentEmail = "azatuly.eskat@enu.kz"; // first student
  const student = await prisma.user.findUnique({ where: { email: studentEmail }, include: { enrollments: true } });
  console.log("STUDENT ENROLLMENTS:", student?.enrollments.length);
}
main().finally(() => prisma.$disconnect());
