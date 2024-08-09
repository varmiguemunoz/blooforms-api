import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFormDto {
  @IsNotEmpty()
  @IsString()
  form_name: string;

  @IsNotEmpty()
  @IsString()
  form_value: string;
}
