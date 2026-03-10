import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import * as fs from "fs";
import { MaterialsService } from "./materials.service";
import { CreateMaterialDto } from "./dto/create-material.dto";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

@Controller("materials")
export class MaterialsController {
    constructor(private readonly materialsService: MaterialsService) {}

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

    @Post("upload")
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: uploadsDir,
                filename: (_req, file, cb) => {
                    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                    const ext = path.extname(file.originalname);
                    cb(null, `${uniqueSuffix}${ext}`);
                },
            }),
            limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return {
            url: `/uploads/${file.filename}`,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
        };
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.materialsService.remove(id);
    }
}
