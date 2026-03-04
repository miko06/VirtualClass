import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { ClassesModule } from "./classes/classes.module";

@Module({
  imports: [PrismaModule, UsersModule, ClassesModule],
})
export class AppModule { }
