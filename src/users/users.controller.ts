import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { FacUsuarios } from 'src/entities/fac-usuarios.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  findOneUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FacUsuarios> | HttpException {
    return this.usersService.findOneUser(id);
  }

  @Post()
  createUser(
    @Body() newUser: CreateUserDto,
  ): Promise<FacUsuarios | HttpException> {
    const user = this.usersService.create(newUser);
    return user;
  }
}
