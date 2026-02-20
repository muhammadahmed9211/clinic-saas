import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { BonusesService } from './bonuses.service';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';


@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Bonus')
@Controller({ path: 'bonuses', version: '1' })
export class BonusesController {
  constructor(private readonly bonusesService: BonusesService) {}

  @Get()
  getBonuses() {
    return this.bonusesService.getBonuses();
  }

  @Post('apply')
  @ApiBody({ schema: { properties: { code: { type: 'string' } } } })
  applyBonus(@Body('code') code: string) {
    return this.bonusesService.applyBonus(code);
  }
}
