import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { ClassesModule } from "./classes/classes.module";
import { MaterialsModule } from "./materials/materials.module";
import { AiModule } from "./ai/ai.module";
import { AdminModule } from "./admin/admin.module";

@Module({
  imports: [PrismaModule, UsersModule, ClassesModule, MaterialsModule, AiModule, AdminModule],
})
export class AppModule { }
