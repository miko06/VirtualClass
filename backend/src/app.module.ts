import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { ClassesModule } from "./classes/classes.module";
import { MaterialsModule } from "./materials/materials.module";

@Module({
  imports: [PrismaModule, UsersModule, ClassesModule, MaterialsModule],
})
export class AppModule { }
