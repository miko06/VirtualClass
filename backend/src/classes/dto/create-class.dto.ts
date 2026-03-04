import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateClassDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    teacherId: number;

    @IsNumber()
    @IsOptional()
    disciplineId?: number;

    @IsString()
    @IsOptional()
    semester?: string;
}
