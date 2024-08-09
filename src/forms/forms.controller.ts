import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { FacEspacios } from 'src/entities/fac-espacios.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { CreateSpaceDto } from './dto/create-space.dto';
import { DimFormularios } from 'src/entities/dim-formularios.entity';

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
  ): Promise<FacEspacios> | HttpException {
    return this.formService.getOneForm(id);
  }

  @Post('/create-space')
  createSpace(
    @Body() newUser: CreateSpaceDto,
  ): Promise<FacEspacios | HttpException> {
    return this.formService.createSpace(newUser);
  }

  @Post('/create-form/:id')
  createForm(
    @Param('id', ParseIntPipe) id: number,
    @Body() form: CreateFormDto,
  ): Promise<void | DimFormularios | FacEspacios> {
    return this.formService.createForm(form, id);
  }

  @Delete('/delete-register/:id')
  deleteRegister(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_forms', ParseIntPipe) id_forms: number,
  ): Promise<DimFormularios | FacEspacios> {
    return this.formService.deleteRegister(id, id_forms);
  }

  @Delete('/delete-space/:id')
  deleteSpace(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.formService.deleteSpace(id);
  }
}
