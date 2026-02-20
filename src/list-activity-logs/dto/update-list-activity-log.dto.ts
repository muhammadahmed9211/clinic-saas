import { PartialType } from '@nestjs/swagger';
import { CreateListActivityLogDto } from './create-list-activity-log.dto';

export class UpdateListActivityLogDto extends PartialType(CreateListActivityLogDto) {}
