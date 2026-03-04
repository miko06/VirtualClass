import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    return this.usersService.login(body.email, body.password);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
