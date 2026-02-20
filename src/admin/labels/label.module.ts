import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { User } from 'src/users/entities/user.entity';
import { Regulations } from '../regulations/entities/regulations.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelController } from './label.controller';
import { LabelService } from './label.service';
import { labelRepository } from './label.repository';

@Module({
  controllers: [LabelController],
  imports: [
    TypeOrmModule.forFeature([
      Regulations,
      Label,
      LabelTranslation,
      User,
    ]),
  ],
  providers: [LabelService,labelRepository],
  exports: [LabelService],
})
export class LabelModule {}
