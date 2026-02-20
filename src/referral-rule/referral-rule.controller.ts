import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  SerializeOptions,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReferralRuleService } from './referral-rule.service'
import { CreateRuleCriteriaDto } from './dto/create-rule-criteria.dto';
import { UpdateRuleCriteriaDto } from './dto/update-rule-criteria.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Referral Rule')
 @SerializeOptions({
    groups: ['admin'],
  })
@Controller({
  path: 'referral-rule',
  version: '1',
})

export class ReferralRuleController {
    constructor(private readonly ReferralRuleService: ReferralRuleService) {}
      
@Post('create')
createCriteria(@Body() dto: CreateRuleCriteriaDto,  @GetUser() user: User) {
    return this.ReferralRuleService.createRuleCriteria(
        dto.referralProgramId,
        dto.ruleName,
        user.id,
        dto.values,
        dto.operator,
    );
}
    
  @Get()
  findAll() {
    return this.ReferralRuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ReferralRuleService.findOne(id);
  }

  @Patch(':id')
  updateCriteria(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRuleCriteriaDto, @GetUser() user: User
    ) {
    return this.ReferralRuleService.updateRuleCriteria(id, dto, user.id);
    }

  @Delete('delete/:id')
  deleteCriteria(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
  return this.ReferralRuleService.deleteRuleCriteria(id, user.id);
  }

  @Get('program/:referralProgramId')
  getCriteriaByReferralProgramId(@Param('referralProgramId', ParseIntPipe) referralProgramId: number) {
    return this.ReferralRuleService.getCriteriaByReferralProgramId(referralProgramId);
  }

}
