import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacSpaces } from 'src/entities/fac-spaces.entity';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { Events } from 'src/entities/events.entity';
import { Customers } from 'src/entities/customers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FacSpaces, Events, Customers])],
  providers: [FormsService],
  controllers: [FormsController],
})
export class FormsModule {}
