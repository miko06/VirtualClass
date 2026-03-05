import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.material.create({
      data: {
        title: "Test",
        type: "document",
        courseName: "Веб-разработка",
        teacherId: 39,
        isVerified: true,
      }
    });
    console.log("Success");
  } catch (e) {
    console.error("Prisma Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
