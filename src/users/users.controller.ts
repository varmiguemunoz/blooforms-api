import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { FacUsuarios } from 'src/entities/fac-usuarios.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    return this.usersService.createUser(newUser);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<FacUsuarios | HttpException> {
    return this.usersService.update(id, user);
  }
}
