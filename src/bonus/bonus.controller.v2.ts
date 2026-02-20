import { Body, Controller, Delete, Get, Post, Query, SerializeOptions, UseGuards } from '@nestjs/common';
import { BonusService } from './bonus.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidateBonusDto } from './dto/validate-bonus.dto';

@Controller({ path: 'bonus', version: '2' })
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class BonusControllerV2 {
  constructor(private readonly bonusService: BonusService) { }

  @SerializeOptions({ groups: [] })
  @Get('all')
  @ApiTags('Bonus Client')
  async getBonusList(@GetUser() user: User, @Query("method") method: string, @Query("version") version: string) {
    if(Number(version) === 2){
      return this.bonusService.getBonusList(user.id, method);
    }
    return this.bonusService.getBonusListV1(user.id , method)
  }

  @SerializeOptions({ groups: [] })
  @Post('validate')
  @ApiTags('Bonus Client')
  @ApiBody({ type: ValidateBonusDto })
  async validateBonusCode(
    @Body() dto: ValidateBonusDto,
    @GetUser() user: User,
    @Query("version") version: string
  ) {
    if(Number(version) === 2){
      return this.bonusService.validateBonusCode(user, dto);
    }
    return this.bonusService.validateBonusCodeV1(user, dto);
  }

}
