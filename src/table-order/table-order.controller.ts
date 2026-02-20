import {
  Controller,
  Get,
  Body,
  UseGuards,
  SerializeOptions,
  HttpCode,
  HttpStatus,
  Query,
  Put,
} from '@nestjs/common';
import { TableOrderService } from './table-order.service';
import { CreateTableColumnOrderDto } from './dto/create-table-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { GetTableColumnsDto } from './dto/get-table-order.dto';
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Table Order')
@Controller({
  path: 'table-order',
  version: '1',
})
export class TableOrderController {
  constructor(private readonly tableOrderService: TableOrderService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Put()
  @HttpCode(HttpStatus.OK)
  create(
    @Body() createTableOrderDto: CreateTableColumnOrderDto,
    @GetUser() user: User,
  ) {
    return this.tableOrderService.create(createTableOrderDto, user.id);
  }

  @Get()
  findAll(@GetUser() user: User, @Query() query: GetTableColumnsDto) {
    return this.tableOrderService.findAll(query.tableName, user.id);
  }
}
