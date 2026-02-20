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
import { ListItemService } from './list-item.service';
import { CreateListItemDto } from './dto/create-list-item.dto';
import { UpdateListParam } from './dto/update-list-item.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
@ApiBearerAuth()
@Roles(RoleEnum.super_admin)
@UseGuards(AuthGuard('jwt'))
@ApiTags('List Item')
@Controller({
  path: 'admin/list-item',
  version: '1',
})
export class ListItemController {
  constructor(private readonly listUtilsService: ListItemService) {}

  @Post()
  create(@Body() createListUtilDto: CreateListItemDto, @GetUser() user: User) {
    return this.listUtilsService.create(createListUtilDto, user.id);
  }

  @Get()
  findAll() {
    return this.listUtilsService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: UpdateListParam) {
    return this.listUtilsService.findOne(+params.id);
  }

  @Patch(':id')
  update(
    @Param() params: UpdateListParam,
    @Body() updateListUtilDto: CreateListItemDto,
  ) {
    return this.listUtilsService.update(params.id, updateListUtilDto);
  }

  @Delete(':id')
  remove(@Param() params: UpdateListParam) {
    return this.listUtilsService.remove(+params.id);
  }
}
