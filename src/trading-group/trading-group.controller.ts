import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TradingGroupService } from './trading-group.service';
import { CreateTradingGroupDto } from './dto/create-trading-group.dto';
import { UpdateTradingGroupDto } from './dto/update-trading-group.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Trading Groups')
@Controller({ version: '1', path: 'trading-group' })
export class TradingGroupController {
  constructor(private readonly tradingGroupService: TradingGroupService) {}

  @Post()
  create(@Body() createTradingGroupDto: CreateTradingGroupDto) {
    return this.tradingGroupService.create(createTradingGroupDto);
  }

  @Get()
  findAll(@Query("classificationId") classificationId : string, @Query("type") type:string) {
    return this.tradingGroupService.findAll({
      classificationId:+classificationId,
      type
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradingGroupService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTradingGroupDto: UpdateTradingGroupDto,
  ) {
    return this.tradingGroupService.update(+id, updateTradingGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tradingGroupService.remove(+id);
  }
}
