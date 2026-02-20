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
import { ListFilterColumnsService } from './list-filter-columns.service';
import {
  AddListFiltersDto,
  CreateListFilterColumnDto,
} from './dto/create-list-filter-column.dto';
import { UpdateListFilterColumnDto } from './dto/update-list-filter-column.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Advance Filters')
@Controller({
  path: 'admin/list-filter-columns',
  version: '1',
})
export class ListFilterColumnsController {
  constructor(
    private readonly listFilterColumnsService: ListFilterColumnsService,
  ) {}

  @Put()
  add(@Body() addListFilter: AddListFiltersDto, @GetUser() user: User) {
    return this.listFilterColumnsService.add(addListFilter, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user : User) {
    return this.listFilterColumnsService.remove(+id , user.id);
  }
}

export class ListFilterColumnsControllerV2 {
  constructor(
    private readonly listFilterColumnsService: ListFilterColumnsService,
  ) {}

  @Post()
  create(@Body() createListFilterColumnDto: CreateListFilterColumnDto) {
    return this.listFilterColumnsService.create(createListFilterColumnDto);
  }

  @Get()
  findAll() {
    return this.listFilterColumnsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listFilterColumnsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateListFilterColumnDto: UpdateListFilterColumnDto,
  ) {
    return this.listFilterColumnsService.update(+id, updateListFilterColumnDto);
  }

  @Put()
  add(@Body() addListFilter: AddListFiltersDto, @GetUser() user: User) {
    return this.listFilterColumnsService.add(addListFilter, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user : User) {
    return this.listFilterColumnsService.remove(+id , user.id);
  }
}
