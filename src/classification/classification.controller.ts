import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Admin Classification')
@Controller({
  path: 'admin/classification',
  version: '1',
})
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Get()
  findAll() {
    return this.classificationService.findAll();
  }

}
