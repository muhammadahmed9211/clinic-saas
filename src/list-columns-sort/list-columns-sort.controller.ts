import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ListColumnsSortService } from './list-columns-sort.service';
import { CreateListColumnsSortDto } from './dto/create-list-columns-sort.dto';
import { UpdateListColumnsSortDto } from './dto/update-list-columns-sort.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('List Columns Sort')
@Controller({
  path: 'admin/list-columns-sort',
  version: '1',
})
export class ListColumnsSortController {
  constructor(
    private readonly listColumnsSortService: ListColumnsSortService,
  ) {}

  @Post()
  create(@Body() createListColumnsSortDto: CreateListColumnsSortDto) {
    return this.listColumnsSortService.create(createListColumnsSortDto);
  }

  @Get()
  findAll() {
    return this.listColumnsSortService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listColumnsSortService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateListColumnsSortDto: UpdateListColumnsSortDto,
  ) {
    return this.listColumnsSortService.update(+id, updateListColumnsSortDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listColumnsSortService.remove(+id);
  }
}
