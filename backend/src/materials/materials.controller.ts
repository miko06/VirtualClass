import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { MaterialsService } from "./materials.service";
import { CreateMaterialDto } from "./dto/create-material.dto";

@Controller("materials")
export class MaterialsController {
    constructor(private readonly materialsService: MaterialsService) { }

    @Get()
    findAll() {
        return this.materialsService.findAll();
    }

    @Get("teacher/:teacherId")
    findByTeacher(@Param("teacherId", ParseIntPipe) teacherId: number) {
        return this.materialsService.findByTeacher(teacherId);
    }

    @Post()
    create(@Body() dto: CreateMaterialDto) {
        return this.materialsService.create(dto);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.materialsService.remove(id);
    }
}
