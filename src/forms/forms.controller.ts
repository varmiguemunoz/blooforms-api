import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FormsService } from './forms.service';

@Controller('forms')
@ApiTags('Forms')
export class FormsController {
  constructor(private formService: FormsService) {}

  @Get()
  getForms() {
    return this.formService.getForms();
  }
}
