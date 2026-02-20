import { Module } from '@nestjs/common';
import { CustomDropdownController } from './custom-dropdown.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomDropdownService } from './custom-dropdown.service';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { Client } from 'src/users/entities/client.entity';
import { ClientsModule } from 'src/users/clients.module';
import { Desk } from './entities/desk.entity';
import { OperatorDeskRel } from './entities/operator-desk.entity';
import { Operator } from './entities/operator.entity';
import { RejectedReason } from 'src/admin/kyc/entities/rejected_reasons.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { Office } from './entities/office.entity';
import { DeskType } from './entities/desk_type.entity';
import { RoleModule } from 'src/roles/role.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [CustomDropdownController],
  imports: [
    ClientsModule,
    RoleModule,
    TypeOrmModule.forFeature([
      CustomStatus,
      Client,
      Desk,
      Office,
      OperatorDeskRel,
      Operator,
      RejectedReason,
      LabelTranslation,
      DeskType,
      User,
    ]),
  ],
  providers: [CustomDropdownService],
  exports: [CustomDropdownService],
})
export class CustomDropdownModule {}
