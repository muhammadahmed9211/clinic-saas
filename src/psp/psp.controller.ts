import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SerializeOptions,
  HttpCode,
  HttpStatus,
  Query,
  Get,
} from '@nestjs/common';
import { PspService } from './psp.service';
import { CreatePspDto } from './dto/create-psp.dto';
import { UpdatePSPDto } from './dto/update-psp.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('PSP')
@Controller({
  path: 'admin/psp',
  version: '1',
})
export class PspController {
  constructor(private readonly pspService: PspService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createPspDto: CreatePspDto, @GetUser() user: User) {
    return this.pspService.create(createPspDto, user.id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get("methods")
  @HttpCode(HttpStatus.OK)
  getMethods() {
    return this.pspService.getMethods();
  }
  
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  get(@Param("id") id:string) {
    return this.pspService.getOne(+id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('list')
  @HttpCode(HttpStatus.OK)
  findAllWithFilters(
    @Query() pagination: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
    @GetUser() user: User,
  ) {
    const { limit = 10, page = 1 } = pagination || {};
    return this.pspService.findAll(limit, page, body, user.id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updatePspDto: UpdatePSPDto,
    @GetUser() user: User,
  ) {
    return this.pspService.update(+id, updatePspDto, user.id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.pspService.remove(+id, user.id);
  }
}
