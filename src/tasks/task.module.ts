import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterTask } from './entities/master_task.entity';
import { Label } from './entities/label.entity';
import { LabelTranslation } from './entities/label_translation.entity';
import { MasterTaskController } from './task.controller';
import { MasterTaskService } from './task.service';
import { UserTask } from './entities/user_task.entity';
import { CrmTask } from './entities/crm_task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MasterTaskRepository } from './repositories/master_task.repository';

@Global()
@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([
      MasterTask,
      Label,
      LabelTranslation,
      UserTask,
      CrmTask,
    ]),
  ],
  controllers: [MasterTaskController],
  providers: [MasterTaskService, MasterTaskRepository],
  exports: [MasterTaskService],
})
export class MasterTaskModule {}
