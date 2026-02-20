import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MaskDataService } from './maskData.service';
import { CreateMaskDataDto } from './dto/createMaskData.dto';
import { UpdateMaskDataDto } from './dto/updatemaskData.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller({ path: 'mask-data', version: '1' })
@ApiTags('Mask Data')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class MaskDataController {
  constructor(private readonly maskDataService: MaskDataService) {}

  @Post()
  async create(@Body() body: CreateMaskDataDto, @GetUser() user: User) {
    return await this.maskDataService.create(body , user);
  }

  @Get()
  async getAll() {
    return await this.maskDataService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return await this.maskDataService.getById(id);
  }

  @Get('/role/:id')
  async getByRoleId(@Param('id') id: number) {
    return await this.maskDataService.getByRoleId(id);
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() body: UpdateMaskDataDto, @GetUser() user: User) {
    return await this.maskDataService.update(id, body, user);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.maskDataService.delete(id);
  }
}
