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
} from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { CreateAggregatorDto } from './dto/create-aggregator.dto';
import { UpdateAggregatorDto } from './dto/update-aggregator.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Aggregators')
@Controller({
  path: 'admin/aggregator',
  version: '1',
})
export class AggregatorController {
  constructor(private readonly aggregatorService: AggregatorService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  create(
    @Body() createAggregatorDto: CreateAggregatorDto,
    @GetUser() user: User,
  ) {
    return this.aggregatorService.create(createAggregatorDto, user.id);
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
    return this.aggregatorService.findAll(limit, page, body, user.id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateAggregatorDto: UpdateAggregatorDto,
    @GetUser() user: User,
  ) {
    return this.aggregatorService.update(+id, updateAggregatorDto, user.id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.aggregatorService.remove(+id, user.id);
  }
}
