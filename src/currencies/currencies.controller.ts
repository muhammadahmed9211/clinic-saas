import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Currencies')
@Controller({
  path: 'admin/currencies',
  version: '1',
})
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.currenciesService.findAll();
  }

}
