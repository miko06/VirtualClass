import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { ClassesService } from "./classes.service";
import { CreateClassDto } from "./dto/create-class.dto";

@Controller("classes")
export class ClassesController {
    constructor(private readonly classesService: ClassesService) { }

    @Get("teacher/:teacherId")
    findByTeacher(@Param("teacherId", ParseIntPipe) teacherId: number) {
        return this.classesService.findByTeacher(teacherId);
    }

    @Get("student/:studentId")
    findByStudent(@Param("studentId", ParseIntPipe) studentId: number) {
        return this.classesService.findByStudent(studentId);
    }

    @Post()
    create(@Body() dto: CreateClassDto) {
        return this.classesService.create(dto);
    }

    @Put(":id")
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: Partial<CreateClassDto>) {
        return this.classesService.update(id, dto);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.classesService.remove(id);
    }
}
