import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacEspacios } from 'src/entities/fac-espacios.entity';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { DimFormularios } from 'src/entities/dim-formularios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FacEspacios, DimFormularios])],
  providers: [FormsService],
  controllers: [FormsController],
})
export class FormsModule {}
