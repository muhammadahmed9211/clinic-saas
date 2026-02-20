import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ExchangeService } from './exchange.service';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@ApiTags('Transaction Exchanges')
@Controller({
  path: 'admin/exchange',
  version: '1',
})
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createExchangeDto: CreateExchangeDto, @GetUser() user: User) {
    return this.exchangeService.create(createExchangeDto, user.id);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.exchangeService.findAll();
  }
}
