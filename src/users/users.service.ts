import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacUsuarios } from 'src/entities/fac-usuarios.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(FacUsuarios)
    private usersRepository: Repository<FacUsuarios>,
    private readonly configService: ConfigService,
  ) {}

  async getUsers() {
    //El error esta en esta linea
    const users = await this.usersRepository.find();

    if (!users) {
      throw new HttpException(
        'No se encontró ningun usuario en la base de datos.',
        HttpStatus.NOT_FOUND,
      );
    }

    return users;
  }

  async findOneUser(id: number): Promise<FacUsuarios> {
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

  // find users by email
  async findOneByEmail(email: string): Promise<FacUsuarios | undefined> {
    const user = await this.usersRepository.findOne({
      where: { usuario: { email } },
      relations: ['usuario', 'rol', 'area', 'empresa', 'equipo'],
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

  async create(user: CreateUserDto): Promise<FacUsuarios | HttpException> {
    const { id_espacio, password, ...userData } = user;

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
      espacio: {
        id: id_espacio,
      },
    });

    // this.eventEmitter.emit(EVENT_TYPES.USER_CREATED, newUser);

    return newUser;
  }
}
