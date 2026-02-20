import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ListColumnsGroupService } from './list-columns-group.service';
import { CreateListColumnsGroupDto } from './dto/create-list-columns-group.dto';
import {
  UpdateListColumnsGroupDto,
  UpdateListColumnsParamDto,
} from './dto/update-list-columns-group.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetListColumnsParamDto } from './dto/get-list-columns-group.dto';
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('List Column Group')
@Controller({
  path: 'admin/list-columns-group',
  version: '1',
})
export class ListColumnsGroupController {
  constructor(
    private readonly listColumnsGroupService: ListColumnsGroupService,
  ) {}

  @Post()
  create(@Body() createListColumnsGroupDto: CreateListColumnsGroupDto) {
    return this.listColumnsGroupService.create(createListColumnsGroupDto);
  }

  @Get()
  findAll(@Query() query: GetListColumnsParamDto) {
    return this.listColumnsGroupService.findAll(query);
  }

  @Get(':id')
  findOne(@Param() params: UpdateListColumnsParamDto) {
    return this.listColumnsGroupService.findOne(+params.id);
  }

  @Patch(':id')
  update(
    @Param() params: UpdateListColumnsParamDto,
    @Body() updateListColumnsGroupDto: UpdateListColumnsGroupDto,
  ) {
    return this.listColumnsGroupService.update(
      +params.id,
      updateListColumnsGroupDto,
    );
  }

  @Delete(':id')
  remove(@Param() params: UpdateListColumnsParamDto) {
    return this.listColumnsGroupService.remove(+params.id);
  }
}
