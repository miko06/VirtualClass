import { Controller, Get, Post, Delete, Param, ParseIntPipe, Query } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get("classes")
    getAllClasses() {
        return this.adminService.getAllClasses();
    }

    @Get("groups")
    getGroups() {
        return this.adminService.getGroups();
    }

    @Get("groups/:group/students")
    getStudentsByGroup(@Param("group") group: string) {
        return this.adminService.getStudentsByGroup(decodeURIComponent(group));
    }

    @Get("teachers")
    getTeachers() {
        return this.adminService.getTeachers();
    }

    @Post("classes/:classId/enroll-group")
    enrollGroup(
        @Param("classId", ParseIntPipe) classId: number,
        @Query("group") group: string,
    ) {
        return this.adminService.enrollGroup(classId, decodeURIComponent(group));
    }

    @Delete("classes/:classId/unenroll-group")
    unenrollGroup(
        @Param("classId", ParseIntPipe) classId: number,
        @Query("group") group: string,
    ) {
        return this.adminService.unenrollGroup(classId, decodeURIComponent(group));
    }
}
