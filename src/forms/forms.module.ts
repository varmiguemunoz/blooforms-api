import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacSpaces } from 'src/entities/fac-spaces.entity';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { Events } from 'src/entities/events.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FacSpaces, Events])],
  providers: [FormsService],
  controllers: [FormsController],
})
export class FormsModule {}
