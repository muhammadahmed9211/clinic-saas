import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ListViewColumnsService } from './list-view-columns.service';
import {
  AddListViewColumnDto,
  CreateListViewColumnDto,
} from './dto/create-list-view-column.dto';
import { UpdateListViewColumnDto } from './dto/update-list-view-column.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Advance Filters')
@Controller({
  path: 'admin/list-view-columns',
  version: '1',
})
export class ListViewColumnsController {
  constructor(
    private readonly listViewColumnsService: ListViewColumnsService,
  ) { }

  @Put()
  add(@Body() dto: AddListViewColumnDto, @GetUser() user: User) {
    return this.listViewColumnsService.add(dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.listViewColumnsService.remove(+id, user.id);
  }
}

export class ListViewColumnsControllerV2 {
  constructor(
    private readonly listViewColumnsService: ListViewColumnsService,
  ) { }

  @Post()
  create(@Body() createListViewColumnDto: CreateListViewColumnDto) {
    return this.listViewColumnsService.create(createListViewColumnDto);
  }

  @Get()
  findAll() {
    return this.listViewColumnsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listViewColumnsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateListViewColumnDto: UpdateListViewColumnDto,
  ) {
    return this.listViewColumnsService.update(+id, updateListViewColumnDto);
  }

  @Put()
  add(@Body() dto: AddListViewColumnDto, @GetUser() user: User) {
    return this.listViewColumnsService.add(dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.listViewColumnsService.remove(+id, user.id);
  }
}
