import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ListColumnsMetaService } from './list-columns-meta.service';
import { CreateListColumnsMetaDto } from './dto/create-list-columns-meta.dto';
import { UpdateListColumnsMetaDto } from './dto/update-list-columns-meta.dto';
import { GetListColumnsMetaParamDto } from './dto/get-list-columns-meta.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('List Column Group Meta')
@Controller({
  path: 'admin/list-columns-meta',
  version: '1',
})
export class ListColumnsMetaController {
  constructor(
    private readonly listColumnsMetaService: ListColumnsMetaService,
  ) {}

  @Post()
  create(@Body() createListColumnsMetaDto: CreateListColumnsMetaDto) {
    return this.listColumnsMetaService.create(createListColumnsMetaDto);
  }

  @Get()
  findAll(@Query() query: GetListColumnsMetaParamDto) {
    return this.listColumnsMetaService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listColumnsMetaService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateListColumnsMetaDto: UpdateListColumnsMetaDto,
  ) {
    return this.listColumnsMetaService.update(+id, updateListColumnsMetaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listColumnsMetaService.remove(+id);
  }
}
