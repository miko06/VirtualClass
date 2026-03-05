import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMaterialDto } from "./dto/create-material.dto";

@Injectable()
export class MaterialsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.material.findMany({
            include: {
                teacher: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async findByTeacher(teacherId: number) {
        return this.prisma.material.findMany({
            where: { teacherId },
            include: {
                teacher: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async create(dto: CreateMaterialDto) {
        return this.prisma.material.create({
            data: {
                title: dto.title,
                description: dto.description,
                type: dto.type,
                courseName: dto.courseName,
                size: dto.size,
                url: dto.url,
                teacherId: dto.teacherId,
                isVerified: true,
            },
            include: {
                teacher: { select: { id: true, name: true, email: true } },
            },
        });
    }

    async remove(id: number) {
        return this.prisma.material.delete({ where: { id } });
    }
}
