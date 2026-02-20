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
import { ListViewsFilterService } from './list-views-filter.service';
import { CreateListViewsFilterDto } from './dto/create-list-views-filter.dto';
import { UpdateListViewsFilterDto } from './dto/update-list-views-filter.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Advance Filters')
@Controller({
  path: 'admin/list-views-filter',
  version: '1',
})
export class ListViewsFilterController {
  constructor(
    private readonly listViewsFilterService: ListViewsFilterService,
  ) {}

  @Post()
  create(
    @Body() createListViewsFilterDto: CreateListViewsFilterDto,
    @GetUser() user: User,
  ) {
    return this.listViewsFilterService.create(
      createListViewsFilterDto,
      user.id,
    );
  }

}

export class ListViewsFilterControllerV2 {
  constructor(
    private readonly listViewsFilterService: ListViewsFilterService,
  ) {}

  @Post()
  create(
    @Body() createListViewsFilterDto: CreateListViewsFilterDto,
    @GetUser() user: User,
  ) {
    return this.listViewsFilterService.create(
      createListViewsFilterDto,
      user.id,
    );
  }

  @Get()
  findAll() {
    return this.listViewsFilterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listViewsFilterService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateListViewsFilterDto: UpdateListViewsFilterDto,
    @GetUser() user: User,
  ) {
    return this.listViewsFilterService.update(
      +id,
      updateListViewsFilterDto,
      user.id,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.listViewsFilterService.remove(+id, user.id);
  }
}
