import { DataSource, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DimFormularios } from 'src/entities/dim-formularios.entity';
import { FacEspacios } from 'src/entities/fac-espacios.entity';

import { CreateFormDto } from './dto/create-form.dto';
import { CreateSpaceDto } from './dto/create-space.dto';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(FacEspacios)
    private formRepository: Repository<FacEspacios>,
    @InjectRepository(DimFormularios)
    private dimFormRepository: Repository<DimFormularios>,
    private readonly dataSource: DataSource,
  ) {}

  async getForms() {
    const forms = await this.formRepository.find({ relations: ['formulario'] });

    if (!forms) {
      throw new HttpException(
        'No se encontró ningun registro de un formulario',
        HttpStatus.NOT_FOUND,
      );
    }

    return forms;
  }

  async getOneForm(id: number) {
    const forms = await this.formRepository.findOne({
      where: { id },
      relations: ['formulario'],
    });

    if (!forms) {
      throw new HttpException(
        'No se encontró el formulario',
        HttpStatus.NOT_FOUND,
      );
    }

    return forms;
  }

  // Create space
  async createSpace(
    form: CreateSpaceDto,
  ): Promise<FacEspacios | HttpException> {
    const { titulo } = form;

    const newForm = this.formRepository.create({
      titulo: titulo,
    });

    const spaceSaved = await this.dataSource.transaction(async (manager) => {
      const space = await manager.save(FacEspacios, newForm);

      return space;
    });

    return spaceSaved;
  }

  async createForm(
    form: CreateFormDto,
    id_space: number,
  ): Promise<void | DimFormularios | FacEspacios> {
    const { form_name, form_value } = form;

    const register = this.dimFormRepository.create({
      form_name: form_name,
      form_value: form_value,
    });

    const savedRegister = await this.dimFormRepository.save(register);

    if (!savedRegister) {
      throw new HttpException(
        'No se guardo el registro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return await this.addFormToSpace(savedRegister.id, id_space);
  }

  // Update Form
  async addFormToSpace(
    id_form: number,
    id_space: number,
  ): Promise<void | FacEspacios> {
    const validateSpace = await this.formRepository.findOne({
      where: { id: id_space },
      relations: ['formulario'],
    });

    if (!validateSpace) {
      throw new HttpException(
        'No se encontró el espacio.',
        HttpStatus.NOT_FOUND,
      );
    }

    const Isformulario = await this.dimFormRepository.findOne({
      where: { id: id_form },
    });

    if (!Isformulario) {
      throw new HttpException(
        'No se encontró el formulario.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!validateSpace.formulario) {
      validateSpace.formulario = [];
    }

    validateSpace.formulario.push(Isformulario);

    return await this.formRepository.save(validateSpace);
  }

  // No esta eliminando un registro
  async deleteRegister(
    id_space: number,
    id_forms: number,
  ): Promise<DimFormularios | FacEspacios> {
    const space = await this.formRepository.findOne({
      where: { id: id_space },
      relations: ['formulario'],
    });

    if (!space) {
      throw new HttpException(
        'No se encontró el espacio.',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedForms = space.formulario.filter(
      (form) => form.id !== id_forms, // Filtrar el formulario que tiene el formId
    );

    space.formulario = updatedForms;

    return await this.formRepository.save(space);
  }

  async deleteSpace(id_space: number): Promise<string> {
    await this.dataSource.transaction(async (manager) => {
      const space = await manager.findOne(FacEspacios, {
        where: { id: id_space },
        relations: ['formulario'],
      });

      if (!space) {
        throw new HttpException(
          'No se encontró el espacio.',
          HttpStatus.NOT_FOUND,
        );
      }

      if (space.formulario && space.formulario.length > 0) {
        const formIds = space.formulario.map((form) => form.id);
        await manager.delete(DimFormularios, formIds);
      }

      await manager.delete(FacEspacios, { id: id_space });
    });

    return 'Espacio eliminado con exito';
  }
}
