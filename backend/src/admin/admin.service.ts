import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    /** All classes with teacher info and enrolled-groups summary */
    async getAllClasses() {
        const classes = await this.prisma.class.findMany({
            include: {
                teacher: { select: { id: true, name: true, email: true } },
                discipline: true,
                enrollments: {
                    include: {
                        student: { select: { id: true, name: true, group: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return classes.map((cls) => {
            const groupCounts: Record<string, number> = {};
            for (const e of cls.enrollments) {
                const g = e.student.group ?? "—";
                groupCounts[g] = (groupCounts[g] ?? 0) + 1;
            }
            return {
                ...cls,
                enrolledGroups: Object.entries(groupCounts).map(([group, count]) => ({ group, count })),
                totalStudents: cls.enrollments.length,
            };
        });
    }

    /** Distinct groups with student counts */
    async getGroups() {
        const students = await this.prisma.user.findMany({
            where: { role: "student" },
            select: { group: true },
        });
        const counts: Record<string, number> = {};
        for (const s of students) {
            const g = s.group ?? "—";
            counts[g] = (counts[g] ?? 0) + 1;
        }
        return Object.entries(counts)
            .map(([group, count]) => ({ group, count }))
            .sort((a, b) => a.group.localeCompare(b.group));
    }

    /** Students of a specific group */
    async getStudentsByGroup(group: string) {
        return this.prisma.user.findMany({
            where: { role: "student", group },
            select: { id: true, name: true, firstName: true, lastName: true, email: true, group: true },
            orderBy: { lastName: "asc" },
        });
    }

    /** Enroll all students of a group into a class */
    async enrollGroup(classId: number, group: string) {
        const students = await this.prisma.user.findMany({
            where: { role: "student", group },
            select: { id: true },
        });

        if (students.length === 0) {
            return { enrolled: 0, message: `No students found in group ${group}` };
        }

        const result = await this.prisma.enrollment.createMany({
            data: students.map((s) => ({ studentId: s.id, classId })),
            skipDuplicates: true,
        });

        return { enrolled: result.count, total: students.length };
    }

    /** Remove all students of a group from a class */
    async unenrollGroup(classId: number, group: string) {
        const students = await this.prisma.user.findMany({
            where: { role: "student", group },
            select: { id: true },
        });

        const studentIds = students.map((s) => s.id);

        const result = await this.prisma.enrollment.deleteMany({
            where: { classId, studentId: { in: studentIds } },
        });

        return { removed: result.count };
    }

    /** All teachers */
    async getTeachers() {
        return this.prisma.user.findMany({
            where: { role: "teacher" },
            select: { id: true, name: true, email: true, specialtyCode: true },
            orderBy: { name: "asc" },
        });
    }
}
