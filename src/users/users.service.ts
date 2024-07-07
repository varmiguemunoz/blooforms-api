import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacUsuarios } from 'src/entities/fac-usuarios.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(FacUsuarios)
    private usersRepository: Repository<FacUsuarios>,
    private readonly configService: ConfigService,
  ) {}

  async getUsers() {
    const users = await this.usersRepository.find();

    if (!users) {
      return [];
    }

    return users;
  }

  async finOneUser(id: number): Promise<FacUsuarios> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['usuario', 'espacio'],
    });

    if (!user) {
      throw new HttpException(
        'No se encontró el usuario.',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  //hash password service
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(
      this.configService.get<number>('auth.bcryptSaltOrRound'),
    );

    return await bcrypt.hash(password, salt);
  }

  async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, userPassword);
  }
}
