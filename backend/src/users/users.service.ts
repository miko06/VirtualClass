import * as bcrypt from "bcrypt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        group: true,
        specialtyCode: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("Пользователь не найден");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Неверный пароль");
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      group: user.group,
      specialtyCode: user.specialtyCode,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async create(dto: CreateUserDto) {
    const hash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: { ...dto, password: hash, role: dto.role ?? "student" },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        group: true,
        specialtyCode: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
