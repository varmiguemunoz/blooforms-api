import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsEmail,
  IsOptional,
  IsNumber,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  id_espacio?: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
  username: string;
}
