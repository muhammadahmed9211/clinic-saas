import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DemoService } from './demo.service';
import { CreateDemoFormDto } from './dto/demo.dto';


@ApiTags('CRM Website')
@Controller({
  path: 'crm-website/demo',
  version: '1',
})
export class DemoController {
  constructor(private readonly demoService: DemoService) {}


@Post()
@HttpCode(HttpStatus.OK)
async createDemoForm(
@Body() createDemoFormDto: CreateDemoFormDto,
){
    try {
        return await this.demoService.sendDemoRequestForm(createDemoFormDto);
    } catch (error) {
        throw error;
    }
}
}
