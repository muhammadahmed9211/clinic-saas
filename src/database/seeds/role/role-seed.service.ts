import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../../roles/entities/role.entity';
import { RoleEnum } from '../../../roles/roles.enum';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>,
  ) {}

  async run() {
    const countClient = await this.repository.count({
      where: {
        id: RoleEnum.client,
      },
    });

    if (countClient) {
      await this.repository.update(RoleEnum.client, {
        name: 'Client',
        appName: 'client portal',
      });
    } else {
      await this.repository.save({
        id: RoleEnum.client,
        name: 'Client',
        appName: 'client portal',
      });
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RoleEnum.super_admin,
      },
    });

    if (countAdmin) {
      await this.repository.update(RoleEnum.super_admin, {
        id: RoleEnum.super_admin,
        name: 'Super Admin',
      });
    } else {
      await this.repository.save({
        id: RoleEnum.super_admin,
        name: 'Super Admin',
      });
    }

    const existRoles = await this.repository.find({
      where: [
        { id: RoleEnum.user_admin },
        { id: RoleEnum.backoffice_manager },
        { id: RoleEnum.backoffice_specialist },
        { id: RoleEnum.compliance_manager },
        { id: RoleEnum.compliance_specialist },
        { id: RoleEnum.finance_manager },
        { id: RoleEnum.finance_specialist },
        { id: RoleEnum.marketing_manager },
        { id: RoleEnum.marketing_specialist },
        { id: RoleEnum.office_manager },
        { id: RoleEnum.partner },
        { id: RoleEnum.retention_agent },
        { id: RoleEnum.retention_manager },
        { id: RoleEnum.sales_agent },
        { id: RoleEnum.sales_manager },
        { id: RoleEnum.support_agent },
        { id: RoleEnum.support_manager },
      ],
    });

    if (!existRoles.length) {
      const roles = [
        {
          id: RoleEnum.user_admin,
          name: 'User Admin',
          canSeeEmail: false,
          canSeePhoneNumber: false,
          seeOtherConfidentialData: false,
        },
        {
          id: RoleEnum.partner,
          name: 'Partner',
          appName: 'client portal',
        },
        {
          id: RoleEnum.sales_manager,
          name: 'Sales Manager',
        },
        {
          id: RoleEnum.sales_agent,
          name: 'Sales Agent',
        },
        {
          id: RoleEnum.marketing_manager,
          name: 'Marketing Manager',
          canSeeEmail: false,
          canSeePhoneNumber: false,
          seeOtherConfidentialData: false,
        },
        {
          id: RoleEnum.marketing_specialist,
          name: 'Marketing Specialist',
          canSeeEmail: false,
          canSeePhoneNumber: false,
          seeOtherConfidentialData: false,
        },
        {
          id: RoleEnum.backoffice_manager,
          name: 'Backoffice Manager',
          canSeeEmail: false,
          canSeePhoneNumber: false,
          seeOtherConfidentialData: false,
        },
        {
          id: RoleEnum.backoffice_specialist,
          name: 'Backoffice Specialist',
          canSeeEmail: false,
          canSeePhoneNumber: false,
          seeOtherConfidentialData: false,
        },
        {
          id: RoleEnum.finance_manager,
          name: 'Finance Manager',
          canSeeEmail: false,
          canSeePhoneNumber: false,
          seeOtherConfidentialData: false,
        },
        {
          id: RoleEnum.finance_specialist,
          name: 'Finance Specialist',
          canSeeEmail: false,
          canSeePhoneNumber: false,
          seeOtherConfidentialData: false,
        },
        {
          id: RoleEnum.office_manager,
          name: 'Office Manager',
          canSeeEmail: false,
          canSeePhoneNumber: false,
          seeOtherConfidentialData: false,
        },
        {
          id: RoleEnum.retention_agent,
          name: 'Retention Agent',
          canSeeEmail: false,
          canSeePhoneNumber: false,
          seeOtherConfidentialData: false,
        },
        {
          id: RoleEnum.retention_manager,
          name: 'Retention Manager',
          canSeeEmail: false,
          canSeePhoneNumber: false,
          seeOtherConfidentialData: false,
        },
        {
          id: RoleEnum.support_manager,
          name: 'Support Manager',
          canSeeEmail: false,
          canSeePhoneNumber: false,
          seeOtherConfidentialData: false,
        },
        {
          id: RoleEnum.support_agent,
          name: 'Support Agent',
          canSeeEmail: false,
          canSeePhoneNumber: false,
          seeOtherConfidentialData: false,
        },
        {
          id: RoleEnum.compliance_specialist,
          name: 'Compliance Specialist',
          canSeeEmail: false,
          canSeePhoneNumber: false,
          seeOtherConfidentialData: false,
        },
        {
          id: RoleEnum.compliance_manager,
          name: 'Compliance Manager',
          canSeeEmail: false,
          canSeePhoneNumber: false,
          seeOtherConfidentialData: false,
        },
      ];

      await this.repository.save(roles);
    }
  }
}
