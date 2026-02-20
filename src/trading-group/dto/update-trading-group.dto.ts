import { PartialType } from '@nestjs/swagger';
import { CreateTradingGroupDto } from './create-trading-group.dto';

export class UpdateTradingGroupDto extends PartialType(CreateTradingGroupDto) {}
