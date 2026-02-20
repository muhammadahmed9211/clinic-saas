import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from 'src/users/clients.module';
import { OperatorController } from './operator.controller';
import { Operator } from '../custom-dropdown/custom-dropdown/entities/operator.entity';
import { OperatorService } from './operator.service';
import { TaskModule } from '../task/task.module';
import { Desk } from '../custom-dropdown/custom-dropdown/entities/desk.entity';
import { DeskType } from '../custom-dropdown/custom-dropdown/entities/desk_type.entity';
import { CustomStatus } from '../client/entities/custom_status.entity';
import { Office } from '../custom-dropdown/custom-dropdown/entities/office.entity';
import { OperatorDeskRel } from '../custom-dropdown/custom-dropdown/entities/operator-desk.entity';
import { OperatorRepository } from './repositories/operator.repository';
import { operator_links } from './entities/operators-links.entity';
import { User } from 'src/users/entities/user.entity';
import { FilesModule } from 'src/files/files.module';
import { SessionModule } from 'src/session/session.module';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from 'src/roles/role.module';
import { operator_targets } from './entities/operator_targets.entity';
import { Lead } from '../leads/entities/lead.entity';
import { Client } from 'src/users/entities/client.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { PartnerModule } from '../partner/partner.module';
import { AdminTask } from '../task/entities/task.entity';
import { Meetings } from '../leads/meetings/entities/meetings.entity';
import { LeadsCallLog } from '../leads-call-logs/entities/leads-call-log.entity';
import { Opportunity } from '../leads/opportunity/entities/opportunity.entity';
import { notes } from '../kyc/entities/kycNotes.entity';
import { PermissionEndpointService } from 'src/permission_endpoint/permission_endpoint.service';
import { PermissionEndpointModule } from 'src/permission_endpoint/permission_endpoint.module';
import { PermissionEndpoint } from 'src/permission_endpoint/entities/permission_endpoint.entity';
import { PermissionRoleRel } from 'src/roles/entities/permission_role_rel.entity';
import { PermissionEndpointRel } from 'src/permission_endpoint/entities/permission_endpoint_rel.entity';
import { Session } from 'src/session/entities/session.entity';

@Module({
  controllers: [OperatorController],
  imports: [
    ClientsModule,
    PermissionEndpointModule,
    TypeOrmModule.forFeature([
      Operator,
      Desk,
      DeskType,
      CustomStatus,
      Office,
      OperatorDeskRel,
      operator_links,
      User,
      operator_targets,
      Lead,
      Client,
      Partner,
      AdminTask,
      Meetings,
      LeadsCallLog,
      Opportunity,
      notes,
      PermissionEndpoint,
      PermissionRoleRel,
      PermissionEndpointRel,
      Session,
    ]),
    TaskModule,
    FilesModule,
    SessionModule,
    JwtModule,
    RoleModule,
    PartnerModule,
  ],
  providers: [OperatorRepository, OperatorService, PermissionEndpointService],
  exports: [OperatorService],
})
export class OperatorModule {}
