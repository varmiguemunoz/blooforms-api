import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSpaceDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsNumber()
  id_user: number;

  @IsNotEmpty()
  @IsNumber()
  id_space_types: number;
}
