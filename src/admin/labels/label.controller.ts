import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  SerializeOptions,
  UseGuards,
  Request,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LabelService } from './label.service';
import {
  CreateLabelDto,
  LabelDtoAdvance,
  UpdateLabelDto,
  UpdateLabelTranslationTextDto,
} from './dto/label.dto';
import { User } from 'src/users/entities/user.entity';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Admin Labels')
@Controller({
  path: 'admin/label',
  version: '1',
})
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @Get('get-all')
  async getAllLabels() {
    try {
      return await this.labelService.getAllLabels();
    } catch (error) {
      throw error;
    }
  }
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  async createLabel(
    @Body() createLabelDto: CreateLabelDto,
    @Request() req: any,
  ) {
    try {
      const userId = req?.user?.id;
      return await this.labelService.createLabel(createLabelDto, userId);
    } catch (error) {
      throw error;
    }
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getLabel(@Param('id') id: number) {
    try {
      return await this.labelService.getLabel(id);
    } catch (error) {
      throw error;
    }
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateLabel(
    @Param('id') id: number,
    @Body() updateLabelDto: UpdateLabelDto,
    @Request() req: any,
  ) {
    try {
      return await this.labelService.updateLabel(id, updateLabelDto,req.user);
    } catch (error) {
      throw error;
    }
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteLabel(@Param('id') id: number, @Request() req: any,) {
    try {
      return await this.labelService.deleteLabel(id,req.user);
    } catch (error) {
      throw error;
    }
  }

  @SerializeOptions({ groups: ['admin'] })
  @Post('all-list')
  @HttpCode(HttpStatus.OK)
  async getLabelsAdvance(
    @Query() query: LabelDtoAdvance,
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    try {
      const { limit = 10, page = 1 } = query || {};
      return await this.labelService.getAllLabelsAdvance(
        user.id,
        limit,
        page,
        body,
      );
    } catch (error) {
      throw error;
    }
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id/translations')
  async getLabelTranslations(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LabelTranslation[]> {
    try {
      return await this.labelService.getLabelTranslations(id);
    } catch (error) {
      throw error;
    }
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @Patch('translation/:id')
  async updateLabelTranslationText(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTextDto: UpdateLabelTranslationTextDto,
  ): Promise<LabelTranslation> {
    try {
      return await this.labelService.updateText(id, updateTextDto.text);
    } catch (error) {
      throw error;
    }
  }
}
