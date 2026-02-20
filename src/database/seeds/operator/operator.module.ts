import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { OperatorSeedService } from './operator.service';
import { OperatorDeskRel } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator-desk.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operator, OperatorDeskRel, User])],
  providers: [OperatorSeedService],
  exports: [OperatorSeedService],
})
export class OperatorSeedModule {}
