import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FacEspacios } from 'src/entities/fac-espacios.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(FacEspacios)
    private formRepository: Repository<FacEspacios>,
  ) {}

  async getForms() {
    const forms = await this.formRepository.find();

    if (!forms) {
      throw new HttpException(
        'No se encontró ningun registro de un formulario',
        HttpStatus.NOT_FOUND,
      );
    }

    return forms;
  }
}
