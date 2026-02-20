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
import { PspCountryService } from './psp-country.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { CreatePspCountryDto } from './dto/create-psp-country.dto';
import { UpdatePspCountryDto } from './dto/update-psp-country.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('PSP')
@Controller({
  path: 'admin/psp-country',
  version: '1',
})
export class PspCountryController {
  constructor(private readonly pspCountryService: PspCountryService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createPspDto: CreatePspCountryDto, @GetUser() user: User) {
    return this.pspCountryService.create(createPspDto, user.id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get("psp")
  @HttpCode(HttpStatus.OK)
  getPsp() {
    return this.pspCountryService.getPsp();
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get("countries")
  @HttpCode(HttpStatus.OK)
  getCountries() {
    return this.pspCountryService.getCountries();
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  getOne(@Param() id:string) {
    return this.pspCountryService.findOne(+id);
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
    return this.pspCountryService.findAll(limit, page, body, user.id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updatePspDto: UpdatePspCountryDto,
    @GetUser() user: User,
  ) {
    return this.pspCountryService.update(+id, updatePspDto, user.id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.pspCountryService.remove(+id, user.id);
  }
}
