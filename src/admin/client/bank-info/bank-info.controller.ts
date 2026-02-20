import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  Param,
  Body,
  Patch,
  Query,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BankDetailsService } from 'src/bank-details/bank-details.service';
import { UpdateBankDetailDto } from 'src/bank-details/dto/update-bank-detail.dto';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { CreateBankDetailDto } from 'src/bank-details/dto/create-bank-detail.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Admin clients')
@Controller({
  path: 'admin/client',
  version: '1',
})
export class BankInfoController {
  constructor(private readonly bankDetailsService: BankDetailsService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id/bank-info')
  @HttpCode(HttpStatus.OK)
  getById(@Param('id') userId: string, @Query() paginationDto: PaginationDto) {
    return this.bankDetailsService.findAll(+userId, paginationDto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post(':id/bank-info')
  @HttpCode(HttpStatus.OK)
  create(@Param('id') userId: string, @Body() body: CreateBankDetailDto) {
    return this.bankDetailsService.create(body, +userId, true);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('bank-info/:bankInfoId')
  @HttpCode(HttpStatus.OK)
  updateById(
    @Param('bankInfoId') bankInfoId: string,
    @Body() data: UpdateBankDetailDto,
  ) {
    return this.bankDetailsService.update(+bankInfoId, data, 0, true);
  }
}
