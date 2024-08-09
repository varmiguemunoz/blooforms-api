import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssingFormDto {
  @IsNotEmpty()
  @IsNumber()
  espacioId: number;

  @IsNotEmpty()
  @IsNumber()
  formId: number;
}
