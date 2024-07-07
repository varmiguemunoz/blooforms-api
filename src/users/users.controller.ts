import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { FacUsuarios } from 'src/entities/fac-usuarios.entity';

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
    return this.usersService.finOneUser(id);
  }
}
