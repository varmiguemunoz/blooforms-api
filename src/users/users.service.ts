import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FacUsers } from 'src/entities/fac-users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DimUsuarios } from 'src/entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(FacUsers)
    private usersRepository: Repository<FacUsers>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  //Find all users
  async getUsers() {
    const users = await this.usersRepository.find({
      relations: ['usuario'],
    });

    if (!users) {
      throw new HttpException(
        'No se encontró ningun usuario en la base de datos.',
        HttpStatus.NOT_FOUND,
      );
    }

    return users;
  }

  // Find Users
  async findOneUser(id: number): Promise<FacUsers> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!user) {
      throw new HttpException(
        'No se encontró el usuario.',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  // find users by email
  async findOneByEmail(email: string): Promise<FacUsers | undefined> {
    const user = await this.usersRepository.findOne({
      where: { usuario: { email } },
      relations: ['usuario'],
    });

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return user;
  }

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

  // Create Users
  async createUser(user: CreateUserDto): Promise<FacUsers | HttpException> {
    const { password, ...userData } = user;

    const emailTaken = await this.usersRepository.findOne({
      where: { usuario: { email: user.email } },
    });

    if (emailTaken)
      throw new HttpException(
        'El correo electrónico ya se encuentra registrado.',
        HttpStatus.CONFLICT,
      );

    const hashPassword = await this.hashPassword(password);

    const newUser = this.usersRepository.create({
      usuario: {
        ...userData,
        password: hashPassword,
      },
      role: {
        id: null,
      },
      espacio: {
        id: null,
      },
    });

    const userSaved = await this.dataSource.transaction(async (manager) => {
      const user = await manager.save(FacUsers, newUser);

      return user;
    });

    return userSaved;
  }

  //update user service
  async update(
    id: number,
    user: UpdateUserDto,
  ): Promise<FacUsers | HttpException> {
    const { id_espacio, ...userData } = user;

    const userExists = await this.usersRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!userExists)
      throw new HttpException(
        'No se encontró el usuario.',
        HttpStatus.NOT_FOUND,
      );

    if (user.email && user.email !== userExists.usuario.email) {
      const emailTaken = await this.usersRepository.findOne({
        where: { usuario: { email: user.email } },
      });

      if (emailTaken)
        throw new HttpException(
          'El correo electrónico ya se encuentra registrado.',
          HttpStatus.CONFLICT,
        );
    }

    if (user.password) {
      userData.password = await this.hashPassword(user.password);
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.update(
        DimUsuarios,
        { id: userExists.usuario.id },
        userData,
      );

      const facUser = {
        usuario: { id: userExists.usuario.id },
      };

      if (id_espacio) {
        facUser['espacio'] = { id: id_espacio };
      }

      await manager.update(FacUsers, { id }, facUser);
    });

    return this.usersRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
  }
}
