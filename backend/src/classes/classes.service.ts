import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateClassDto } from "./dto/create-class.dto";

@Injectable()
export class ClassesService {
    constructor(private prisma: PrismaService) { }

    async findByTeacher(teacherId: number) {
        return this.prisma.class.findMany({
            where: { teacherId },
            include: {
                discipline: true,
                enrollments: {
                    include: { student: { select: { id: true, name: true, email: true, group: true } } },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async findByStudent(studentId: number) {
        const enrollments = await this.prisma.enrollment.findMany({
            where: { studentId },
            include: {
                class: {
                    include: {
                        discipline: true,
                        teacher: { select: { id: true, name: true, email: true } },
                        enrollments: { select: { id: true } },
                    },
                },
            },
        });
        return enrollments.map((e) => e.class);
    }

    async create(dto: CreateClassDto) {
        const cls = await this.prisma.class.create({
            data: {
                name: dto.name,
                description: dto.description,
                teacherId: dto.teacherId,
                disciplineId: dto.disciplineId,
                semester: dto.semester,
            },
            include: { discipline: true },
        });

        return cls;
    }

    async update(id: number, dto: Partial<CreateClassDto>) {
        return this.prisma.class.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                semester: dto.semester,
            },
        });
    }

    async remove(id: number) {
        await this.prisma.enrollment.deleteMany({ where: { classId: id } });
        return this.prisma.class.delete({ where: { id } });
    }
}
