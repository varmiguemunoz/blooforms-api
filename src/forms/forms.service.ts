import { DataSource, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Events } from 'src/entities/events.entity';
import { FacSpaces } from 'src/entities/fac-spaces.entity';
import { Customers } from 'src/entities/customers.entity';

import { CreateFormDto } from './dto/create-form.dto';
import { CreateSpaceDto } from './dto/create-space.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';

// Refactorizar las funciones de eliminar registros y clientes
// Refactorizar funciones de crear formularios y clientes

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(FacSpaces)
    private formRepository: Repository<FacSpaces>,
    @InjectRepository(Events)
    private dimFormRepository: Repository<Events>,
    @InjectRepository(Customers)
    private dimCustomersRepository: Repository<Customers>,
    private readonly dataSource: DataSource,
  ) {}

  // Obtener espacios ✅
  async getForms() {
    const forms = await this.formRepository.find({
      relations: ['formulario', 'space_type', 'customers', 'user'],
    });

    if (!forms) {
      throw new HttpException(
        'No se encontró ningun registro de un formulario',
        HttpStatus.NOT_FOUND,
      );
    }

    return forms;
  }

  // Obtener un espacio ✅
  async getOneForm(id: number) {
    const forms = await this.formRepository.findOne({
      where: { id },
      relations: ['formulario', 'space_type', 'customers', 'user'],
    });

    if (!forms) {
      throw new HttpException(
        'No se encontró el formulario',
        HttpStatus.NOT_FOUND,
      );
    }

    return forms;
  }

  // Create space ✅
  async createSpace(form: CreateSpaceDto): Promise<FacSpaces | HttpException> {
    const { titulo, id_space_types, id_user } = form;

    const newForm = this.formRepository.create({
      titulo: titulo,

      user: {
        id: id_user,
      },

      space_type: {
        id: id_space_types,
      },
    });

    const spaceSaved = await this.dataSource.transaction(async (manager) => {
      const space = await manager.save(FacSpaces, newForm);

      return space;
    });

    return spaceSaved;
  }

  // crear registros de formulario ✅
  async createForm(
    form: CreateFormDto,
    id_space: number,
  ): Promise<void | Events | FacSpaces> {
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

  // Service to create customers
  async createCustomers(
    customer: CreateCustomerDto,
    id_space: number,
  ): Promise<Customers | FacSpaces> {
    const { name, email, phone } = customer;

    const register = this.dimCustomersRepository.create({
      name: name,
      email: email,
      phone: phone,
    });

    const savedRegister = await this.dimCustomersRepository.save(register);

    if (!savedRegister) {
      throw new HttpException(
        'No se guardo el cliente nuevo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return await this.addCustomerToSpace(savedRegister.id, id_space);
  }

  // Funcion que relaciona el resgistro a un espacio ✅
  async addFormToSpace(
    id_form: number,
    id_space: number,
  ): Promise<void | FacSpaces> {
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

  // Add customer to space
  async addCustomerToSpace(
    id_customer: number,
    id_space: number,
  ): Promise<FacSpaces | Customers> {
    const validateSpace = await this.formRepository.findOne({
      where: { id: id_space },
      relations: ['customers'],
    });

    if (!validateSpace) {
      throw new HttpException(
        'No se encontró el espacio.',
        HttpStatus.NOT_FOUND,
      );
    }

    const IsCustomer = await this.dimCustomersRepository.findOne({
      where: { id: id_customer },
    });

    if (!IsCustomer) {
      throw new HttpException(
        'No se encontró el cliente.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!validateSpace.customers) {
      validateSpace.customers = [];
    }

    validateSpace.customers.push(IsCustomer);

    return await this.formRepository.save(validateSpace);
  }

  //Eliminacion de registros ✅
  async deleteRegister(
    id_space: number,
    id_forms: number,
  ): Promise<Events | FacSpaces> {
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
      (form) => form.id !== id_forms,
    );

    space.formulario = updatedForms;

    return await this.formRepository.save(space);
  }

  //Eliminar clientes ✅
  async deleteCustomers(
    id_space: number,
    id_customer: number,
  ): Promise<Customers | FacSpaces> {
    const space = await this.formRepository.findOne({
      where: { id: id_space },
      relations: ['customers'],
    });

    if (!space) {
      throw new HttpException(
        'No se encontró el espacio.',
        HttpStatus.NOT_FOUND,
      );
    }

    const customer = await this.dimCustomersRepository.findOne({
      where: { id: id_customer },
    });

    if (!customer) {
      throw new HttpException(
        'No se encontró el cliente',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedForms = space.customers.filter(
      (form) => form.id !== id_customer,
    );

    space.customers = updatedForms;

    return await this.formRepository.save(space);
  }

  // Eliminar un espacio ✅
  async deleteSpace(id_space: number): Promise<string> {
    await this.dataSource.transaction(async (manager) => {
      const space = await manager.findOne(FacSpaces, {
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
        await manager.delete(Events, formIds);
      }

      await manager.delete(FacSpaces, { id: id_space });
    });

    return 'Espacio eliminado con exito';
  }
}
