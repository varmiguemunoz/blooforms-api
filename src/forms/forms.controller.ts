import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { FacSpaces } from 'src/entities/fac-spaces.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { CreateSpaceDto } from './dto/create-space.dto';
import { Events } from 'src/entities/events.entity';
import { Public } from 'src/auth/decorators/public.decorator';
import { Customers } from 'src/entities/customers.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('forms')
@ApiTags('Forms')
export class FormsController {
  constructor(private formService: FormsService) {}

  @Get('/get-space')
  getForms() {
    return this.formService.getForms();
  }

  @Get('/get-space/:id')
  findOneUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FacSpaces> | HttpException {
    return this.formService.getOneForm(id);
  }

  @Post('/create-space')
  createSpace(
    @Body() newUser: CreateSpaceDto,
  ): Promise<FacSpaces | HttpException> {
    return this.formService.createSpace(newUser);
  }

  @Public()
  @HttpCode(200)
  @Post('/create-form/:id')
  createForm(
    @Param('id', ParseIntPipe) id: number,
    @Body() form: CreateFormDto,
  ): Promise<void | Events | FacSpaces> {
    return this.formService.createForm(form, id);
  }

  @Post('/create-customer/:id')
  createCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() customer: CreateCustomerDto,
  ): Promise<Customers | FacSpaces> {
    return this.formService.createCustomers(customer, id);
  }

  @Delete('/delete-register/:id')
  deleteRegister(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_forms', ParseIntPipe) id_forms: number,
  ): Promise<Events | FacSpaces> {
    return this.formService.deleteRegister(id, id_forms);
  }

  @Delete('/delete-customer/:id')
  deleteCustomers(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_customer', ParseIntPipe) id_customer: number,
  ): Promise<Customers | FacSpaces> {
    return this.formService.deleteCustomers(id, id_customer);
  }

  @Delete('/delete-space/:id')
  deleteSpace(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.formService.deleteSpace(id);
  }
}
