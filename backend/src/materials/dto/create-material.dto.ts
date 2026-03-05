import { IsString, IsOptional, IsNumber, IsIn, IsNotEmpty } from 'class-validator';

export type MaterialType = 'pdf' | 'video' | 'archive' | 'document' | 'spreadsheet' | 'url' | 'text';

const materialTypes: MaterialType[] = ['pdf', 'video', 'archive', 'document', 'spreadsheet', 'url', 'text'];

export class CreateMaterialDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsIn(materialTypes)
    type: MaterialType;

    @IsString()
    @IsNotEmpty()
    courseName: string;

    @IsString()
    @IsOptional()
    size?: string;

    @IsString()
    @IsOptional()
    url?: string;

    @IsNumber()
    teacherId: number;
}
