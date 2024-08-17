import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsEmail,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsNumber()
  id_role: number;
}
