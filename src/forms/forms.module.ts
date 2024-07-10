import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacEspacios } from 'src/entities/fac-espacios.entity';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FacEspacios])],
  providers: [FormsService],
  controllers: [FormsController],
})
export class FormsModule {}
