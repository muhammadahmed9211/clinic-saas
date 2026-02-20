import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEndpoint } from 'src/permission_endpoint/entities/permission_endpoint.entity';
import { PermissionEndpointRel } from 'src/permission_endpoint/entities/permission_endpoint_rel.entity';
import { PermissionRoleRel } from 'src/roles/entities/permission_role_rel.entity';
import { Permission } from 'src/roles/entities/permissoin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionEndpointSeedService {
  constructor(
    @InjectRepository(PermissionEndpoint)
    private readonly permissionEndpointRepository: Repository<PermissionEndpoint>,
    @InjectRepository(PermissionEndpointRel)
    private readonly permissionEndpointRelRepository: Repository<PermissionEndpointRel>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(PermissionRoleRel)
    private readonly permissionRoleRelRepository: Repository<PermissionRoleRel>,
  ) {}

  async run() {
    const endpointRelExist = await this.permissionEndpointRelRepository.count();
    const rolePermission = await this.permissionRoleRelRepository.count();

    const endpoint = [
      {
        name: 'admin_client_list',
        method: 'Read Users',
        url: '/clients',
        isScreen: true,
        screen: 'screen',
        type: 'page',
      },
      {
        name: 'admin_client_filters',
        method: 'Read Users',
        url: '/clients/advance_filters',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_client_details',
        method: 'Update Users',
        url: '/clients/{id}',
        isScreen: true,
        screen: 'screen',
        type: 'page',
      },
      {
        name: 'admin_kyc_list',
        method: 'Read Kyc Documents',
        url: '/kyc',
        isScreen: true,
        screen: 'screen',
        type: 'page',
      },
      {
        name: 'admin_operator_list',
        method: 'Read Operators',
        url: '/operators',
        isScreen: true,
        screen: 'screen',
        type: 'page',
      },
      {
        name: 'admin_desk_list',
        method: 'Read Desks',
        url: '/desks',
        isScreen: true,
        screen: 'screen',
        type: 'page',
      },
      {
        name: 'admin_transcations_list',
        method: 'Read Transactions',
        url: '/transactions',
        isScreen: true,
        screen: 'screen',
        type: 'page',
      },
      {
        name: 'admin_roles_list',
        method: 'Read Roles',
        url: '/roles',
        isScreen: true,
        screen: 'screen',
        type: 'page',
      },
      {
        name: 'admin_partners',
        method: 'Read Affiliates',
        url: '/partners',
        isScreen: true,
        screen: 'screen',
        type: 'page',
      },
      {
        name: 'admin_client_general',
        method: 'See User General Info Tab',
        url: '/admin_client_general',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_roles_detail',
        method: 'Update Roles',
        url: '/roles/{id}',
        isScreen: true,
        screen: 'screen',
        type: 'page',
      },
      {
        name: 'admin_client_compliance',
        method: 'See User Kyc Info',
        url: '/admin_client_compliance',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_client_transcations',
        method: 'See User Financial Transactions Tab',
        url: '/admin_client_transactions',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_client_trading_accounts',
        method: 'See User Trading Accounts Tab',
        url: '/admin_client_trading_accounts',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_client_activitylog',
        method: 'Read Activity Logs',
        url: '/admin_client_activitylog',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_client_tasks',
        method: 'See User Tasks Tab',
        url: '/admin_client_tasks',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_task_list',
        method: 'Read Tasks',
        url: '/tasks',
        isScreen: true,
        screen: 'screen',
        type: 'page',
      },
      {
        name: 'admin_roles_create',
        method: 'Create Roles',
        url: '/admin_roles_create',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_roles_delete',
        method: 'Delete Roles',
        url: '/admin_roles_delete',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_operator_update',
        method: 'Update Operators',
        url: '/operators/{id}',
        isScreen: true,
        screen: 'screen',
        type: 'page',
      },
      {
        name: 'admin_office_delete',
        method: 'Delete offices',
        url: '/admin_office_delete',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_office_list',
        method: 'Read Offices',
        url: '/offices',
        isScreen: true,
        screen: 'screen',
        type: 'page',
      },
      {
        name: 'admin_office_create',
        method: 'Create offices',
        url: '/admin_office_create',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_operator_create',
        method: 'Create Operators',
        url: '/admin_operator_create',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_operator_delete',
        method: 'Delete Operators',
        url: '/admin_operator_delete',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_office_update',
        method: 'Update Offices',
        url: '/admin_operator_update',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_create_partner',
        method: 'Create Affiliates',
        url: '/admin_create_partner',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_view_partner_details',
        method: 'Update Affiliates',
        url: '/partners/{id}',
        isScreen: true,
        screen: 'screen',
        type: 'page',
      },
      {
        name: 'admin_delete_partner',
        method: 'Delete Affiliates',
        url: '/admin_delete_partner',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_kyc_partner',
        method: 'Set Affiliate Kyc Status',
        url: '/admin_kyc_partner',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_tasks_partner',
        method: 'Can Read Partner Task',
        url: '/admin_tasks_partner',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_password_partner',
        method: 'Can Change Affiliate Password',
        url: '/admin_password_partner',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_create_user',
        method: 'Create Users',
        url: '/admin_create_user',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_update_user',
        method: 'Update Users',
        url: '/admin_update_user',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_client_security',
        method: 'See User Security Info Tab',
        url: '/admin_client_security',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_client_update_kyc_status',
        method: 'set user kyc status',
        url: '/admin_client_update_kyc_status',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_client_financial_general',
        method: 'Can See User Bank Information',
        url: '/admin_client_financial_general',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_create_desk',
        method: 'Create Desks',
        url: '/admin_create_desk',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_update_desk',
        method: 'Update Desks',
        url: '/admin_update_desk',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_delete_desk',
        method: 'Delete Desks',
        url: '/admin_delete_desk',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_partner_links',
        method: 'Create Affiliate Links',
        url: '/admin_partner_links',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_transcation_approve',
        method: 'Edit Transaction Limits',
        url: '/approve_transcation',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_create_tasks',
        method: 'Create Tasks',
        url: '/admin_create_tasks',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_update_tasks',
        method: 'Update Tasks',
        url: '/admin_update_tasks',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_operator_tasks',
        method: 'See Operators Task Tab',
        url: '/operators_tasks',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_client_calllogs',
        method: 'See User Callogs tab',
        url: '/admin_client_calllogs',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_client_emails',
        method: 'See User Emails tab',
        url: '/admin_client_emails',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_create_transactions',
        method: 'Create User Transcation',
        url: '/create-transactions',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_trading_general',
        method: 'See User Trading General Tab',
        url: '/admin_trading_general',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_trading_deals',
        method: 'See User Trading Deal Tab',
        url: '/admin_trading_deals',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_trading_positions',
        method: 'See User Trading Positions Tab',
        url: '/admin_trading_positions',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_trading_change_password',
        method: 'See User Trading Change Password Tab',
        url: '/admin_trading_change_password',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_trading_activitylog',
        method: 'See User Trading Activity Log Tab',
        url: '/admin_trading_activitylog',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_transaction_activitylog',
        method: 'See User Transaction Activity Log Tab',
        url: '/admin_transaction_activitylog',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_transaction_general',
        method: 'See User Transaction General Tab',
        url: '/admin_transaction_general',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_transaction_compliance',
        method: 'See User Transaction Compliance Tab',
        url: '/admin_transaction_compliance',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_transaction_bonus',
        method: 'See User Transaction Bonus Tab',
        url: '/admin_transaction_bonus',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_transaction_tasks',
        method: 'See User Transaction Task Tab',
        url: '/admin_transaction_tasks',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_operator_security',
        method: 'See Operator Security Tab',
        url: '/admin_operator_security',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_operator_general',
        method: 'See Operator General Tab',
        url: '/admin_operator_general',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_operator_activitylog',
        method: 'See Operator Activity Log Tab',
        url: '/admin_operator_activitylog',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_partner_compliance',
        method: 'See Affiliate Compliance Tab',
        url: '/admin_partner_compliance',
        isScreen: true,
        screen: 'screen',
        type: 'tab',
      },
      {
        name: 'admin_create_user_calllogs',
        method: 'Create User Calllogs',
        url: '/admin_create_user_calllogs',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_create_trading_account',
        method: 'Create Trading Accounts',
        url: '/admin_create_trading_account',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_trading_list',
        method: 'Read Trading Accounts',
        url: '/trading-accounts',
        isScreen: true,
        screen: 'screen',
        type: 'page',
      },
      {
        name: 'admin_update_trading_accounts',
        method: 'Update Trading Accounts',
        url: '/admin_update_trading_accounts',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_delete_trading_accounts',
        method: 'Delete Trading Accounts',
        url: '/admin_delete_trading_accounts',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_create_user_emails',
        method: 'Can Send User Email',
        url: '/admin_create_user_emails',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_create_demo_account',
        method: 'Create User Demo Accounts',
        url: '/admin_create_demo_account',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
      {
        name: 'admin_create_user_kyc',
        method: 'Create Kyc Documents',
        url: '/admin_create_user_kyc',
        isScreen: true,
        screen: 'screen',
        type: 'action',
      },
    ];

    for await (const iterator of endpoint) {
      const endpointExist = await this.permissionEndpointRepository.findOneBy({
        method: iterator.method,
      });
      if (!endpointExist) {
        this.permissionEndpointRepository.create(
          await this.permissionEndpointRepository.save(endpoint),
        );
      }
    }

    if (!endpointRelExist) {
      for await (const iterator of endpoint) {
        const findEndpoint = await this.permissionEndpointRepository.findOne({
          where: { method: iterator.method },
        });

        const findPermission = await this.permissionRepository.findOneBy({
          name: iterator.method,
        });

        // const existPermissionEndpointRel =
        //   await this.permissionEndpointRelRepository.findOneBy({
        //     permissionEndpoint: { id: findEndpoint?.id },
        //     permission: { id: findPermission?.id },
        //   });

        // if (!existPermissionEndpointRel) {
        await this.permissionEndpointRelRepository.save({
          permissionEndpoint: { id: findEndpoint?.id },
          permission: { id: findPermission?.id },
        });
        // }
      }
    }

    if (!rolePermission) {
      const findPermission = await this.permissionEndpointRelRepository.find({
        relations: { permission: true, permissionEndpoint: true },
      });

      for await (const iterator of findPermission) {
        // const existPermissionRoleRel =
        //   await this.permissionRoleRelRepository.findOneBy({
        //     permission: { id: iterator.permission.id },
        //     role: { id: 1 },
        //   });
        // if (!existPermissionRoleRel) {
        await this.permissionRoleRelRepository.save({
          permission: { id: iterator.permission.id },
          role: { id: 1 },
        });
        // }
      }
    }
  }
}
