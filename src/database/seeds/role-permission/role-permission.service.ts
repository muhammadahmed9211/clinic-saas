import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionCategory } from 'src/roles/entities/permission_category.entity';
import { Permission } from 'src/roles/entities/permissoin.entity';
import { RoleFilter } from 'src/roles/entities/role_filter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolePermissionServiceSeed {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(PermissionCategory)
    private readonly permissionCategoryRepository: Repository<PermissionCategory>,
    @InjectRepository(RoleFilter)
    private readonly roleFilterRepository: Repository<RoleFilter>,
  ) {}

  async run() {
    const countPermissionCategory =
      await this.permissionCategoryRepository.count();
    if (!countPermissionCategory) {
      const permissionCategory = [
        {
          name: 'General',
        },
        {
          name: 'User',
        },
        { name: 'Communication' },
        { name: 'Notifications' },
      ];

      await this.permissionCategoryRepository.save(permissionCategory);
    }

    const countPermission = await this.permissionRepository.count();
    if (!countPermission) {
      const permission = [
        {
          key: 'MASTER_ROLE',
          category: 'System',
          subCategory: 'Master Role',
          name: 'Master Role',
          description:
            'Master roles are put on the top of the global role hierarchy',
          readOnly: true,
        },
        {
          key: 'CREATE_ROLES',
          category: 'System',
          subCategory: 'Roles',
          name: 'Create Roles',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'READ_ROLES',
          category: 'System',
          subCategory: 'Roles',
          name: 'Read Roles',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'UPDATE_ROLES',

          category: 'System',
          subCategory: 'Roles',
          name: 'Update Roles',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'DELETE_ROLES',

          category: 'System',
          subCategory: 'Roles',
          name: 'Delete Roles',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'CAN_EXPORT_ROLES',

          category: 'System',
          subCategory: 'Roles',
          name: 'Can Export Roles',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_IMPORT_ROLES',

          category: 'System',
          subCategory: 'Roles',
          name: 'Can Import Roles',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_DELETED_ROLES',

          category: 'System',
          subCategory: 'Roles',
          name: 'See Deleted Roles',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_HIDDEN_ROLES',

          category: 'System',
          subCategory: 'Roles',
          name: 'See Hidden Roles',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'IS_BETA_TESTER',

          category: 'General',
          subCategory: 'General',
          name: 'Is Beta Tester',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'SEE_HIDDEN_PERMISSIONS',

          category: 'System',
          subCategory: 'Roles',
          name: 'See Hidden Permissions',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'CAN_BYPASS_ROLE_HIERARCHY',

          category: 'System',
          subCategory: 'Roles',
          name: 'Can Bypass Role Hierarchy',
          description:
            'Roles with this permission will not be bound to their subordinate roles',
          readOnly: false,
        },
        {
          key: 'SET_ROLE_HIDDEN',

          category: 'System',
          subCategory: 'Roles',
          name: 'Set Role Hidden',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_ROLE_WEIGHT',

          category: 'System',
          subCategory: 'Roles',
          name: 'Set Role Weight',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_DEPARTMENTS',

          category: 'System',
          subCategory: 'Departments',
          name: 'Create Departments',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_DEPARTMENTS',

          category: 'System',
          subCategory: 'Departments',
          name: 'Read Departments',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_DEPARTMENTS',

          category: 'System',
          subCategory: 'Departments',
          name: 'Update Departments',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_DEPARTMENTS',

          category: 'System',
          subCategory: 'Departments',
          name: 'Delete Departments',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SEE_LAST_ANALYST_CALL',

          category: 'System',
          subCategory: 'Departments',
          name: 'Can See Last Analyst Call',
          description:
            'Roles with this permission will be able to view analyst call columns at Clients --> Clients / Advanced grid',
          readOnly: false,
        },
        {
          key: 'CAN_BYPASS_DEPARTMENT_RESTRICTIONS',

          category: 'System',
          subCategory: 'Departments',
          name: 'Can Bypass Department Restrictions',
          description:
            'Roles with this permission will be able to view all departments regardless of association',
          readOnly: false,
        },
        {
          key: 'CREATE_DEPARTMENT_RULES',

          category: 'System',
          subCategory: 'Departments',
          name: 'Create Department Rules',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_DEPARTMENT_RULES',

          category: 'System',
          subCategory: 'Departments',
          name: 'Read Department Rules',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_DEPARTMENT_RULES',

          category: 'System',
          subCategory: 'Departments',
          name: 'Update Department Rules',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_DEPARTMENT_RULES',

          category: 'System',
          subCategory: 'Departments',
          name: 'Delete Department Rules',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_DESKS',

          category: 'System',
          subCategory: 'Desks',
          name: 'Create Desks',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'READ_DESKS',

          category: 'System',
          subCategory: 'Desks',
          name: 'Read Desks',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'UPDATE_DESKS',

          category: 'System',
          subCategory: 'Desks',
          name: 'Update Desks',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'DELETE_DESKS',

          category: 'System',
          subCategory: 'Desks',
          name: 'Delete Desks',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_INACTIVE_DESKS',

          category: 'System',
          subCategory: 'Desks',
          name: 'See Inactive Desks',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_DESK_ACTIVE',

          category: 'System',
          subCategory: 'Desks',
          name: 'Set Desk Active',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_DESK_RULES',

          category: 'System',
          subCategory: 'Desk Rules',
          name: 'Read Desk Rules',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_DESK_RULES',

          category: 'System',
          subCategory: 'Desk Rules',
          name: 'Update Desk Rules',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_DESK_RULES',

          category: 'System',
          subCategory: 'Desk Rules',
          name: 'Delete Desk Rules',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_DESKS_STATUS_REROUTE_RULE',

          category: 'System',
          subCategory: 'Desk Status Reroute Rule',
          name: 'Create Desks Status Reroute Rule',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_DESKS_STATUS_REROUTE_RULE',

          category: 'System',
          subCategory: 'Desk Status Reroute Rule',
          name: 'Update Desks Status Reroute Rule',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_DESKS_STATUS_REROUTE_RULE',

          category: 'System',
          subCategory: 'Desk Status Reroute Rule',
          name: 'Delete Desks Status Reroute Rule',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_DESKS_STATUS_REROUTE_RULE',

          category: 'System',
          subCategory: 'Desk Status Reroute Rule',
          name: 'Read Desks Status Reroute Rule',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_CREDIT',

          category: 'System',
          subCategory: 'Credit',
          name: 'Read Credit',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_CREDIT',

          category: 'System',
          subCategory: 'Credit',
          name: 'Create Credit',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_CREDIT',

          category: 'System',
          subCategory: 'Credit',
          name: 'Update Credit',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_CREDIT',

          category: 'System',
          subCategory: 'Credit',
          name: 'Delete Credit',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_USERS',

          category: 'User',
          subCategory: 'Users',
          name: 'Create Users',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'CREATE_USERS_IN_CORP_FL',

          category: 'User',
          subCategory: 'Users',
          name: 'Create Users In Corp Fl',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_USERS',
          type: 'Scoped',
          category: 'User',
          subCategory: 'Users',
          name: 'Read Users',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'READ_USERS_OF_CERTAIN_AFFILIATES',
          type: 'Scoped',
          category: 'User',
          subCategory: 'Users',
          name: 'Read Users Of Certain Affiliates',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_USERS',
          category: 'User',
          subCategory: 'Users',
          name: 'Update Users',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'CAN_SEE_USER_FINANCIAL_INFO',

          category: 'User',
          subCategory: 'Users',
          name: 'Can See User Financial Info',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_PARTIAL_USERS',

          category: 'User',
          subCategory: 'Users',
          name: 'Read Partial Users',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_AGGREGATED_USERS',

          category: 'User',
          subCategory: 'Users',
          name: 'Read Aggregated Users',
          description: 'See Clients Advanced Search',
          readOnly: false,
        },
        {
          key: 'CAN_READ_USER_COMMUNICATIONS',

          category: 'User',
          subCategory: 'User Communications',
          name: 'Can Read User Communications',
          description:
            'Roles with this permission can see user communications (notes, emails, etc.)',
          readOnly: false,
        },
        {
          key: 'CAN_CREATE_USER_COMMUNICATIONS',

          category: 'User',
          subCategory: 'User Communications',
          name: 'Can Create User Communications',
          description:
            'Roles with this permission can create user communications (notes, emails, etc.)',
          readOnly: false,
        },
        {
          key: 'SEE_HIDDEN_NOTES',

          category: 'User',
          subCategory: 'User Communications',
          name: 'See Hidden Notes',
          description: 'Roles with this permission can see hidden roles',
          readOnly: false,
        },
        {
          key: 'CAN_PURGE_USERS',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Purge Users',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_RENEW_USERS',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Renew Users',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_RENEWED',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Renewed',
          description: 'Role with this permission can if a user was renewed',
          readOnly: false,
        },
        {
          key: 'CAN_RESET_USER_EMAIL_BOUNCED',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Reset User Email Bounced',
          description: 'Role with this permission can reset user email bounced',
          readOnly: false,
        },
        {
          key: 'READ_PLATFORM_TYPES',

          category: 'User',
          subCategory: 'Platforms',
          name: 'Read Platform Types',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_PLATFORM_TYPES',

          category: 'User',
          subCategory: 'Platforms',
          name: 'Create Platform Types',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_PLATFORM_TYPES',

          category: 'User',
          subCategory: 'Platforms',
          name: 'Update Platform Types',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_AFFILIATE',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Affiliate',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_TEST',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Test',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_PASSWORD',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Password',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_PHONE',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Phone',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_SKYPE',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Skype',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_ALLOW_DEPOSIT',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Allow Deposit',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_BLOCK_CLIENT_AREA',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Block Client Area',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_INVESTMENT_MANAGEMENT',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Investment Management',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_PROBLEMATIC',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Problematic',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_KYC_NOTE',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Kyc Note',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_NATIONALITY',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Nationality',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_KYC_WORKFLOW_STATUS',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Kyc Workflow Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_HIDE_FUTURE_DEPOSITS_FROM_API',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Reset Settings',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'SEE_RESET_USER_DATA',

          category: 'User',
          subCategory: 'Users',
          name: 'See Data of User With Reset Settings',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'SET_USER_KYC_STATUS',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Kyc Status',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SET_USER_BLOCK_COMMUNICATIONS',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Block Communications',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_BLOCK_EMAILS',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Block Emails',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_AUTOMATIC_WITHDRAWAL',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Automatic Withdrawal',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_PRO',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Pro',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_TRANSFER_BETWEEN_ACCOUNTS',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Transfer Between Accounts',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_TRADING_CENTRAL_ACTIVE',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Trading Central Active',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_BYPASS_NEXMO',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Bypass Nexmo',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'SET_USER_TELEPHONE_VALID',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Telephone Valid',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_SECOND_TELEPHONE_VALID',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Second Telephone Valid',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_EMAIL_CONFIRMED',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Email Confirmed',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_BANK_INFORMATION',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update User Bank Information',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_IS_EXTENDED_CALL_HOURS',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Is Extended Call Hours',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_AML_NOTE',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Aml Note',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_AML_STATUS',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Aml Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_AML_WORKFLOW_STATUS',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Aml Workflow Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_PROBLEMATIC_REASON',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Problematic Reason',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_SUSPICIOUS',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Suspicious',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_REGISTRATION_IP',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Registration Ip',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'SEE_HIDDEN_EMAILS',

          category: 'User',
          subCategory: 'Users',
          name: 'See Hidden Emails',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'SEE_HIDDEN_PHONES',

          category: 'User',
          subCategory: 'Users',
          name: 'See Hidden Phones',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'SEE_USER_PASSWORDS',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Passwords',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'SEE_USER_TYPES',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Types',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_KYC_NOTES',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Kyc Notes',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_KYC_EDIT_INFO_TAB',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Kyc Edit Info Tab',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_NATIONALITY',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Nationality',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_TEST_USERS',

          category: 'User',
          subCategory: 'Users',
          name: 'See Test Users',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_PROBLEMATIC_USERS',

          category: 'User',
          subCategory: 'Users',
          name: 'See Problematic Users',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_PURGED_USERS',

          category: 'User',
          subCategory: 'Users',
          name: 'See Purged Users',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_CURRENT_PAGE',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Current Page',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_IS_EXTENDED_CALL_HOURS',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Is Extended Call Hours',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_TEST',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Test',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_ALLOW_DEPOSIT',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Allow Deposit',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_BLOCK_CLIENT_AREA',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Block Client Area',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_INVESTMENT_MANAGEMENT',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Investment Management',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_PROBLEMATIC',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Problematic',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_BLOCK_COMMUNICATIONS',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Block Communications',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_BLOCK_EMAILS',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Block Emails',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_AUTOMATIC_WITHDRAWAL',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Automatic Withdrawal',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_PRO',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Pro',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_TRANSFER_BETWEEN_ACCOUNTS',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Transfer Between Accounts',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_TRADING_CENTRAL_ACTIVE',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Trading Central Active',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_TELEPHONE_VALID',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Telephone Valid',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_SECOND_TELEPHONE_VALID',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Second Telephone Valid',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_EMAIL_CONFIRMED',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Email Confirmed',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_HIDE_FUTURE_DEPOSITS_FROM_API',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Reset Settings',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'SEE_USER_AFFILIATE',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Affiliate',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_SOURCE',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Source',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_SOURCE',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Source',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_KYC_INFO',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Kyc Info',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'CAN_SEE_USER_BANK_INFORMATION',

          category: 'User',
          subCategory: 'Users',
          name: 'Can See User Bank Information',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'CAN_SEE_USER_CALL_RECORDINGS',

          category: 'User',
          subCategory: 'User Communications',
          name: 'Can See User Call Recordings',
          description: 'Roles with this permission can see ninja call record',
          readOnly: false,
        },
        {
          key: 'SEE_USER_NINJA_INFO',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Ninja Info',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_NINJA_DESK_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Ninja Desk Column',
          description:
            'Roles with this permission allows to see column ninja desk in user grids',
          readOnly: false,
        },
        {
          key: 'SEE_USER_AML_NOTE',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Aml Note',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_AML_STATUS',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Aml Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_AML_WORKFLOW_STATUS',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Aml Workflow Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_PROBLEMATIC_REASON',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Problematic Reason',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_SUSPICIOUS',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Suspicious',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_ONLINE_PLATFORM',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Online Platform',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_SERVER_INFO',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Server Info',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_SALES_REP_FULL_NAME_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Sales Rep Full Name Column',
          description:
            'Roles with this permission allows to see salesRepFullName column',
          readOnly: false,
        },
        {
          key: 'SEE_USER_RETENTION_REP_FULL_NAME_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Retention Rep Full Name Column',
          description:
            'Roles with this permission allows to see retentionRepFullName column',
          readOnly: false,
        },
        {
          key: 'SEE_USER_KYC_NOTE_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Kyc Note Column',
          description:
            'Roles with this permission allows to see kycNote column',
          readOnly: false,
        },
        {
          key: 'SEE_USER_ACQUISITION_STATUS_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Acquisition Status Column',
          description:
            'Roles with this permission allows to see acquisitionStatus column',
          readOnly: false,
        },
        {
          key: 'SEE_USER_SALES_STATUS_DISPLAY_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Sales Status Display Column',
          description:
            'Roles with this permission allows to see salesStatusDisplay column',
          readOnly: false,
        },
        {
          key: 'SEE_USER_SALES_CLIENT_POTENTIAL_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Sales Client Potential Column',
          description:
            'Roles with this permission allows to see salesClientPotential column',
          readOnly: false,
        },
        {
          key: 'SEE_USER_AUDIT_STATUS_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Audit Status Column',
          description:
            'Roles with this permission allows to see auditStatus column',
          readOnly: false,
        },
        {
          key: 'SEE_USER_MARKETING_TYPE_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Marketing Type Column',
          description:
            'Roles with this permission allows to see marketingType column',
          readOnly: false,
        },
        {
          key: 'SEE_USER_RETENTION_STATUS_DISPLAY_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Retention Status Display Column',
          description:
            'Roles with this permission allows to see retentionStatusDisplay column',
          readOnly: false,
        },
        {
          key: 'SEE_USER_KYC_WORKFLOW_STATUS_DISPLAY_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Kyc Workflow Status Display Column',
          description:
            'Roles with this permission allows to see kycWorkflowStatusDisplay column',
          readOnly: false,
        },
        {
          key: 'SEE_USER_SALES_DESK_NAME_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Sales Desk Name Column',
          description:
            'Roles with this permission allows to see salesDeskName column',
          readOnly: false,
        },
        {
          key: 'SEE_USER_RETENTION_DESK_NAME_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Retention Desk Name Column',
          description:
            'Roles with this permission allows to see retentionDeskName column',
          readOnly: false,
        },
        {
          key: 'SEE_USER_WHATSAPP_SENT',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Whatsapp Sent',
          description:
            'Roles with this permission are allowed to see user whatsapp sent toggle',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_WHATSAPP_SENT',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update User Whatsapp Sent',
          description:
            'Roles with this permission are allowed to update user whatsapp sent toggle',
          readOnly: false,
        },
        {
          key: 'CAN_STAR_USER_COMMUNICATIONS',

          category: 'User',
          subCategory: 'User Communications',
          name: 'Can Star User Communications',
          description:
            'Roles with this permission can star user communications (notes, emails, etc.)',
          readOnly: false,
        },
        {
          key: 'CAN_DOWNLOAD_CALL_RECORD',

          category: 'User',
          subCategory: 'User Communications',
          name: 'Can Download Call Record',
          description:
            'Roles with this permission download ninja call recordings',
          readOnly: false,
        },
        {
          key: 'CAN_BULK_UPDATE_USERS',

          category: 'User',
          subCategory: 'Bulk User Actions',
          name: 'Can Bulk Update Users',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_MASS_RECYCLE_USERS',

          category: 'User',
          subCategory: 'Bulk User Actions',
          name: 'Can Mass Recycle Users',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_CALL_USERS',

          category: 'User',
          subCategory: 'User Communications',
          name: 'Can Call Users',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_LOGIN_AS_USERS',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Login As Users',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'CAN_UPLOAD_USERS',

          category: 'User',
          subCategory: 'Bulk User Actions',
          name: 'Can Upload Users',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SEND_USER_SMS',

          category: 'User',
          subCategory: 'User Communications',
          name: 'Can Send User Sms',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SEND_USER_WHATSAPP',

          category: 'User',
          subCategory: 'User Communications',
          name: 'Can Send User Whatsapp',
          description: 'Can send whatsapp to clients via client notes.',
          readOnly: false,
        },
        {
          key: 'CAN_SEND_USER_WHATSAPP_IN_APP',

          category: 'User',
          subCategory: 'User Communications',
          name: 'Can Send User Whatsapp In App',
          description:
            "Can send Whatsapp message to clients via an external app (gives operator access to the users's phone number).",
          readOnly: false,
        },
        {
          key: 'CAN_SEND_USER_EMAIL',

          category: 'User',
          subCategory: 'User Communications',
          name: 'Can Send User Email',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'CAN_SEND_USER_PRIVATE_EMAIL',

          category: 'User',
          subCategory: 'User Communications',
          name: 'Can Send User Private Email',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SEND_USER_MESSAGE',

          category: 'User',
          subCategory: 'User Communications',
          name: 'Can Send User Message',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SEND_USER_MESSAGE_BULK',

          category: 'User',
          subCategory: 'User Communications',
          name: 'Can Send User Message Bulk',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SEND_USER_PUSH_NOTIFICATION',

          category: 'User',
          subCategory: 'User Communications',
          name: 'Can Send User Push Notification',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_BULK_FORCE_USER_PASSWORD_CHANGE',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Bulk Force User Password Change',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_FORCE_USER_PASSWORD_CHANGE',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Force User Password Change',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_DEACTIVATE_USER_OTP',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Deactivate User Otp',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UNBLOCK_USER_OTP',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Unblock User Otp',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_REVOKE_USER_SSO_TOKENS',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Revoke User Sso Tokens',
          description: 'Roles with this permission can revoke users SSO tokens',
          readOnly: false,
        },
        {
          key: 'CAN_REGENERATE_USER_SECURITY_CODE',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Regenerate User Security Code',
          description:
            'Regenerate identification code for an operator to identify himself when having a conversation with clients',
          readOnly: false,
        },
        {
          key: 'CAN_RETRY_USER_EMAIL',

          category: 'User',
          subCategory: 'User Communications',
          name: 'Can Retry User Email',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_REPS',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update User Reps',
          description:
            'Roles with this permission can update Custom Reps on a given user subject to other custom department restrictions',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_REPS_BULK',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update User Reps Bulk',
          description:
            'Roles with this permission can mass update Custom Reps on a given user subject to other custom department restrictions',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_CUSTOM_DEP_DROPDOWNS',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update Custom Dep Dropdowns',
          description:
            'Roles with this permission can update Custom Dropdowns on a given user subject to other custom department restrictions',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_CUSTOM_DEP_DROPDOWNS_BULK',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update Custom Dep Dropdowns Bulk',
          description:
            'Roles with this permission can mass update Custom Dropdowns on given users subject to other custom department restrictions',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_KYC_INFO',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update User Kyc Info',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_KYC_INFO_BULK',

          category: 'User',
          subCategory: 'Bulk User Actions',
          name: 'Can Update User Kyc Info Bulk',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_SALES_INFO',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update User Sales Info',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_ALL_USER_SALES_INFO',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update All User Sales Info',
          description:
            'Roles with this permission can bypass access restrictions when updating user sales info',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_SALES_INFO_BULK',

          category: 'User',
          subCategory: 'Bulk User Actions',
          name: 'Can Update User Sales Info Bulk',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_NINJA_INFO',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update User Ninja Info',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_NINJA_INFO_BULK',

          category: 'User',
          subCategory: 'Bulk User Actions',
          name: 'Can Update User Ninja Info Bulk',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_RETENTION_INFO',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update User Retention Info',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_RETENTION_INFO_BULK',

          category: 'User',
          subCategory: 'Bulk User Actions',
          name: 'Can Update User Retention Info Bulk',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_ACQUISITION_STATUS',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update User Acquisition Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_QUESTIONNAIRE',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update User Questionnaire',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_READ_USER_MIGRATED_DATA',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Read User Migrated Data',
          description:
            'Roles with this permission can read the migrated data of a given user, if such data exists',
          readOnly: false,
        },
        {
          key: 'SET_USER_EMAIL',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Email',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SEND_USER_VERIFICATION',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Send User Verification',
          description:
            'Roles with this permission can create a verification request to a verifier(e.g. Trulioo, ISignThis) for a user',
          readOnly: false,
        },
        {
          key: 'CAN_CLICK_TO_EMAIL',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Click To Email',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_CLICK_USER_ID_IN_NINJA',

          category: 'User',
          subCategory: 'Ninja',
          name: 'Can Click User Id In Ninja',
          description:
            "Roles with this permission can click on the user ID in the Ninja call view to open the user's information in a new tab",
          readOnly: false,
        },
        {
          key: 'CAN_SEE_USER_NAME_IN_NINJA',

          category: 'User',
          subCategory: 'Ninja',
          name: 'Can See User Name In Ninja',
          description:
            'Roles with this permission can see user name in incoming call',
          readOnly: false,
        },
        {
          key: 'SET_USER_FIRST_NAME',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User First Name',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_LAST_NAME',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Last Name',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_DATE_OF_BIRTH',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Date Of Birth',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_COUNTRY',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Country',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_ID_PASSPORT_NUMBER',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Id Passport Number',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_LANGUAGE',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Language',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_MIDDLE_NAME',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Middle Name',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_MOTHERS_NAME',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Mothers Name',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_COUNTRY_OF_BIRTH',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Country Of Birth',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_TIN_NUMBER',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Tin Number',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_EXPORT_USER_EMAILS',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Export User Emails',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'SEE_USER_LEAD_PHONE_VALID',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Lead Phone Valid',
          description:
            'Roles with this permission can see the Phone Valid toggle when creating a lead for a user.',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_FIRST_RETENTION_REP',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update User First Retention Rep',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_RETENTION_REP',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update User Retention Rep',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_FIRST_RETENTION_REP_BULK',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update User First Retention Rep Bulk',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_GENERAL_INFO_TAB',

          category: 'User',
          subCategory: 'Users',
          name: 'See User General Info Tab',
          description: 'Can see users general info tab',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_EDIT_USER_PERSONAL_INFO_TAB',

          category: 'User',
          subCategory: 'Users',
          name: 'See Edit User Personal Info Tab',
          description: 'Can see users edit info tab',
          readOnly: false,
        },
        {
          key: 'SEE_USER_FINANCIAL_TRANSACTIONS_TAB',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Financial Transactions Tab',
          description: 'Can see users financial transactions tab',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_USER_TRADING_ACCOUNTS_TAB',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Trading Accounts Tab',
          description: 'Can see users trading accounts tab',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_USER_SECURITY_INFO_TAB',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Security Info Tab',
          description: 'Can see users security tab',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_USER_TRACKING_INFO_TAB',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Tracking Info Tab',
          description: 'Can see users tracking tab',
          readOnly: false,
        },
        {
          key: 'SEE_USER_DUPLICATE_ACCOUNTS_TAB',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Duplicate Accounts Tab',
          description: 'Can see user duplicates tab',
          readOnly: false,
        },
        {
          key: 'SEE_USER_MAM_PAM_INFO_TAB',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Mam Pam Info Tab',
          description: 'Can see user mam-pam tab',
          readOnly: false,
        },
        {
          key: 'SEE_PROMOTE_LEAD_TO_CLIENT_TAB',

          category: 'User',
          subCategory: 'Users',
          name: 'See Promote Lead To Client Tab',
          description: 'Can see Promote to client tab',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_BROKER_SALES_STATUS',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update Broker Sales Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_LOAN_AMOUNT',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Loan Amount',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_TERM_LENGTH',

          category: 'User',
          subCategory: 'Users',
          name: 'See User Term Length',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_LOAN_AMOUNT',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Loan Amount',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_TERM_LENGTH',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Term Length',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_CONVERTED',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Converted',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_BONUS_ABUSER',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Bonus Abuser',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_AUDIT_STATUS',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update User Audit Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_USER_SALES_ID_STATUS',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Update User Sales Id Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_PRICE',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Price',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_USER_BROKER_NAME',

          category: 'User',
          subCategory: 'Users',
          name: 'Set User Broker Name',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SEE_USER_AFFILIATE_IB',

          category: 'User',
          subCategory: 'Users',
          name: 'Can See User Affiliate Ib',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_TRANSACTION_LIMITS',
          category: 'User',
          subCategory: 'Transaction Limits',
          name: 'Create Transaction Limits',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_TRANSACTION_LIMITS',

          category: 'User',
          subCategory: 'Transaction Limits',
          name: 'Get Transaction Limits',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_TRANSACTION_LIMITS',

          category: 'User',
          subCategory: 'Transaction Limits',
          name: 'Edit Transaction Limits',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_TRANSACTION_LIMITS',

          category: 'User',
          subCategory: 'Transaction Limits',
          name: 'Delete Transaction Limits',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_USER_BONUSES',

          category: 'User',
          subCategory: 'Users Bonuses',
          name: 'Create User Bonuses',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_USER_BONUSES',

          category: 'User',
          subCategory: 'Users Bonuses',
          name: 'Read User Bonuses',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_USER_BONUSES',

          category: 'User',
          subCategory: 'Users Bonuses',
          name: 'Update User Bonuses',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_USER_BONUSES',

          category: 'User',
          subCategory: 'Users Bonuses',
          name: 'Delete User Bonuses',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_PURGED_USER_DATA',

          category: 'User',
          subCategory: 'Users',
          name: 'Read Purged User Data',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_TASKS',

          category: 'General',
          subCategory: 'Tasks',
          name: 'Create Tasks',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'UPDATE_TASKS',

          category: 'General',
          subCategory: 'Tasks',
          name: 'Update Tasks',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'READ_TASKS',
          type: 'Scoped',
          category: 'General',
          subCategory: 'Tasks',
          name: 'Read Tasks',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'DELETE_TASKS',

          category: 'General',
          subCategory: 'Tasks',
          name: 'Delete Tasks',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATES_TASK_NOTES',

          category: 'General',
          subCategory: 'Tasks',
          name: 'Can Updates Task Notes',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_RECEIVE_TASKS',

          category: 'General',
          subCategory: 'Tasks',
          name: 'Can Receive Tasks',
          description: 'Roles with this permission can be assigned to a task',
          readOnly: false,
        },
        {
          key: 'CREATE_PSP',

          category: 'System',
          subCategory: 'Psps',
          name: 'Create Psp',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_PSP',

          category: 'System',
          subCategory: 'Psps',
          name: 'Read Psp',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_PSP',

          category: 'System',
          subCategory: 'Psps',
          name: 'Update Psp',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_PSP_LIMITS',

          category: 'System',
          subCategory: 'Psp Limits',
          name: 'Create Psp Limits',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_PSP_LIMITS',

          category: 'System',
          subCategory: 'Psp Limits',
          name: 'Read Psp Limits',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_PSP_LIMITS',

          category: 'System',
          subCategory: 'Psp Limits',
          name: 'Update Psp Limits',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_PSP_LIMITS',

          category: 'System',
          subCategory: 'Psp Limits',
          name: 'Delete Psp Limits',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_PSP_RULES',

          category: 'System',
          subCategory: 'Psp Rules',
          name: 'Create Psp Rules',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_PSP_RULES',

          category: 'System',
          subCategory: 'Psp Rules',
          name: 'Read Psp Rules',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_PSP_RULES',

          category: 'System',
          subCategory: 'Psp Rules',
          name: 'Update Psp Rules',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_PSP_RULES',

          category: 'System',
          subCategory: 'Psp Rules',
          name: 'Delete Psp Rules',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_SELECTION',

          category: 'System',
          subCategory: 'Selections',
          name: 'Create Selection',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_SELECTION',

          category: 'System',
          subCategory: 'Selections',
          name: 'Read Selection',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_SELECTION',

          category: 'System',
          subCategory: 'Selections',
          name: 'Update Selection',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_SELECTION',

          category: 'System',
          subCategory: 'Selections',
          name: 'Delete Selection',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_USER_REGISTRATION_LOG',

          category: 'System',
          subCategory: 'User Registration Log',
          name: 'Read User Registration Log',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_USER_REGISTRATION_LOG',

          category: 'System',
          subCategory: 'User Registration Log',
          name: 'Update User Registration Log',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_TRADE_GROUP',

          category: 'System',
          subCategory: 'Trade Groups',
          name: 'Read Trade Group',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_TRADE_GROUP',

          category: 'System',
          subCategory: 'Trade Groups',
          name: 'Create Trade Group',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_TRADE_GROUP',

          category: 'System',
          subCategory: 'Trade Groups',
          name: 'Update Trade Group',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_TRADE_GROUP',

          category: 'System',
          subCategory: 'Trade Groups',
          name: 'Delete Trade Group',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_USER_TYPES',

          category: 'User',
          subCategory: 'User Types',
          name: 'Create User Types',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_USER_TYPES',

          category: 'User',
          subCategory: 'User Types',
          name: 'Update User Types',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_USER_TYPES',

          category: 'User',
          subCategory: 'User Types',
          name: 'Delete User Types',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_USE_NINJA',

          category: 'Ninja',
          subCategory: 'General',
          name: 'Can Use Ninja',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_BULK_REFRESH_NINJA_USERS',

          category: 'Ninja',
          subCategory: 'Bulk Actions',
          name: 'Can Bulk Refresh Ninja Users',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_BULK_RESET_NINJA_USERS',

          category: 'Ninja',
          subCategory: 'Bulk Actions',
          name: 'Can Bulk Reset Ninja Users',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USERS_IN_NINJA_DESKS',

          category: 'Ninja',
          subCategory: 'General',
          name: 'See Users In Ninja Desks',
          description:
            'Roles with this permission can see users who are assigned to a Ninja desks, otherwise they are hidden',
          readOnly: false,
        },
        {
          key: 'CAN_BOOST_NINJA_SCORE',

          category: 'Ninja',
          subCategory: 'General',
          name: 'Can Boost Ninja Score',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_NINJA_DASHBOARD',

          category: 'Ninja',
          subCategory: 'Dashboards',
          name: 'See Ninja Dashboard',
          description:
            'Roles with this permission can see the Ninja Dashboard in the Ninja page',
          readOnly: false,
        },
        {
          key: 'SEE_NINJA_MANAGER_DASHBOARD',

          category: 'Ninja',
          subCategory: 'General',
          name: 'See Call Manager',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_ALL_CALLS_IN_NINJA_MANAGER_DASHBOARD',

          category: 'Ninja',
          subCategory: 'General',
          name: 'See All Available Calls Call Manager regardless of assignment of desk/user visibility',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_NINJA_MANAGER_DESKS',

          category: 'Ninja',
          subCategory: 'General',
          name: 'Can Update Ninja Manager Desks',
          description:
            'Roles with this permission can update operator desks in the Ninja Manager page',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_NINJA_MANAGER_NINJA_SCORE',

          category: 'Ninja',
          subCategory: 'General',
          name: 'Can Update Ninja Manager Ninja Score',
          description:
            'Roles with this permission can update operator ninja score in the Ninja Manager page',
          readOnly: false,
        },
        {
          key: 'SEE_NINJA_PARAMETER_SCORES',

          category: 'Ninja',
          subCategory: 'General',
          name: 'See Ninja Parameter Scores',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_NINJA_USER_TYPES',

          category: 'Ninja',
          subCategory: 'General',
          name: 'See Ninja User Types',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_FORCE_NINJA_LOGOUT',

          category: 'Ninja',
          subCategory: 'General',
          name: 'Can Force Ninja Logout',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USERS_NINJA_DESK_IN_NINJA',

          category: 'Ninja',
          subCategory: 'General',
          name: 'See Users Ninja Desk In Ninja',
          description: 'See the Users Ninja Desk in Ninja',
          readOnly: false,
        },
        {
          key: 'SEE_NINJA_REDIAL_BUTTON',

          category: 'Ninja',
          subCategory: 'General',
          name: 'See Ninja Redial Button',
          description: 'See Redial Button in Ninja',
          readOnly: false,
        },
        {
          key: 'SEE_NINJA_REGISTRATION_NOTES',

          category: 'Ninja',
          subCategory: 'General',
          name: 'See Ninja Registration Notes',
          description: 'See Registration notes in ninja call',
          readOnly: false,
        },
        {
          key: 'SEE_NINJA_TRADING_ACCOUNTS',

          category: 'User',
          subCategory: 'Ninja',
          name: 'See Ninja Trading Accounts',
          description: 'See user trading accounts in ninja call',
          readOnly: false,
        },
        {
          key: 'CREATE_NINJA_RULES',

          category: 'Ninja',
          subCategory: 'Ninja Rules',
          name: 'Create Ninja Rules',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_NINJA_RULES',

          category: 'Ninja',
          subCategory: 'Ninja Rules',
          name: 'Read Ninja Rules',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_NINJA_RULES',

          category: 'Ninja',
          subCategory: 'Ninja Rules',
          name: 'Update Ninja Rules',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_NINJA_RULES',

          category: 'Ninja',
          subCategory: 'Ninja Rules',
          name: 'Delete Ninja Rules',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPLOAD_NINJA_RULES',

          category: 'Ninja',
          subCategory: 'Ninja Rules',
          name: 'Can Upload Ninja Rules',
          description:
            'Roles with this permission can bulk Upload CSV Ninja Rules',
          readOnly: false,
        },
        {
          key: 'READ_NINJA_BOOST',

          category: 'Ninja',
          subCategory: 'Ninja Boost',
          name: 'Read Ninja Boost',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_CALLBACKS',

          category: 'User',
          subCategory: 'Callbacks',
          name: 'Create Callbacks',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_CALLBACKS',

          category: 'User',
          subCategory: 'Callbacks',
          name: 'Read Callbacks',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_CALLBACKS',

          category: 'User',
          subCategory: 'Callbacks',
          name: 'Update Callbacks',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_CALLBACKS',

          category: 'User',
          subCategory: 'Callbacks',
          name: 'Delete Callbacks',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_CALL_DURATION_DROPDOWN',

          category: 'User',
          subCategory: 'Callbacks',
          name: 'See Call Duration Dropdown',
          description:
            'Roles with this permission can see call duration dropdown for callback',
          readOnly: false,
        },
        {
          key: 'SET_CALLBACK_OPERATOR',

          category: 'User',
          subCategory: 'Callbacks',
          name: 'Set Callback Operator',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_CURRENCIES',

          category: 'System',
          subCategory: 'Currencies',
          name: 'Create Currencies',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_CURRENCIES',

          category: 'System',
          subCategory: 'Currencies',
          name: 'Read Currencies',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_CURRENCIES',

          category: 'System',
          subCategory: 'Currencies',
          name: 'Update Currencies',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_BROKER_USERS_AS_AFFILIATE',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Read Leads On Affiliate Portal',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_BROKER_USERS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Create Trading Accounts',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'READ_BROKER_USERS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Read Trading Accounts',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'UPDATE_BROKER_USERS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Update Trading Accounts',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'DELETE_BROKER_USERS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Delete Trading Accounts',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_DELETED_BROKER_USERS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'See Deleted Trading Accounts',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_HIDDEN_BROKER_USERS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'See Hidden Trading Accounts',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_BROKER_USER_MANAGED_ACCOUNT',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'See Trading Account Managed Account',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_BROKER_USER_MANAGED_MASTER_ACCOUNT',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'See Trading Account Managed Master Account',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_COMMENT_ON_TRADING_PLATFORM',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Set Comment On Trading Platform',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_BROKER_USER_RETENTION_REP_FULL_NAME_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See Broker User Retention Rep Full Name Column',
          description:
            'Roles with this permission allows to see retentionRepFullName column',
          readOnly: false,
        },
        {
          key: 'SEE_BROKER_USER_SALES_REP_FULL_NAME_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See Broker User Sales Rep Full Name Column',
          description:
            'Roles with this permission allows to see salesRepFullName column',
          readOnly: false,
        },
        {
          key: 'SEE_FIRST_SALES_REP_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See First Sales Rep Column',
          description:
            'Roles with this permission allows to see firstSalesRep column',
          readOnly: false,
        },
        {
          key: 'SEE_FIRST_SALES_REP_ASSIGNMENT_DATE_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See First Sales Rep Assignment Date Column',
          description:
            'Roles with this permission allows to see firstSalesRepAssignmentDate column',
          readOnly: false,
        },
        {
          key: 'SEE_FIRST_RETENTION_REP_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See First Retention Rep Column',
          description:
            'Roles with this permission allows to see firstRetentionRep column',
          readOnly: false,
        },
        {
          key: 'SEE_FIRST_RETENTION_REP_ASSIGNMENT_DATE_COLUMN',

          category: 'User',
          subCategory: 'Users',
          name: 'See First Retention Rep Assignment Date Column',
          description:
            'Roles with this permission allows to see firstRetentionRepAssignmentDate column',
          readOnly: false,
        },
        {
          key: 'CAN_CANCEL_BROKER_USER_BANKINGS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Can Cancel Trading Account Transactions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_CHANGE_BROKER_USER_CREDIT',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Can Change Trading Account Credit',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_CREATE_BROKER_USER_DEMO_DEPOSITS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Can Create Trading Account Demo Deposits',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_CREATE_BROKER_USER_DEPOSITS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Can Create Trading Account Deposits',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_APPROVE_BROKER_USER_DEPOSITS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Can Approve Trading Account Deposits',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_CREATE_BROKER_USER_WITHDRAWALS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Can Create Trading Account Withdrawals',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_APPROVE_BROKER_USER_WITHDRAWALS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Can Create Trading Approve Withdrawals',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_TRANSFER_BROKER_USER_FUNDS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Can Transfer Trading Account Funds',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_LOGIN_AS_BROKER_USER',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Can Login As Trading Account',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_FORCE_CANCEL_BROKER_USER_BANKINGS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Can Force Cancel Trading Account Transactions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_OVERRIDE_VALIDATION_FORCE_CANCEL_BROKER_USER_BANKINGS',

          category: 'User',
          subCategory: 'Users',
          name: 'Can Override Validation Force Cancel Broker User Bankings',
          description:
            'Can Override Validation For Force Cancel BrokerBankings',
          readOnly: true,
        },
        {
          key: 'CAN_BULK_UPDATE_BROKER_USERS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Can Bulk Update Trading Accounts',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_USER_CPA_PAID',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Set Trading Account CPA Paid',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_USER_AFFILIATE_CPA_PAID',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Set Trading Account Affiliate CPA Paid',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_USER_TRADING_ACTIVE',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Set Trading Account Active/Read Only',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_USER_ALLOW_DEPOSIT',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Set Trading Account Allow Deposit',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_USER_MANAGED_ACCOUNT',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Set Trading Account Managed Account',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_USER_MANAGED_MASTER_ACCOUNT',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Set Trading Account Managed Master Account',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_USER_LEVERAGE',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Set Trading Account Leverage',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_USER_TRADE_GROUPS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Set Trading Account Groups',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_USER_FIXED_CURRENCY_RATIO',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Set Trading Account Fixed Currency Ratio',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_INVALIDATE_BROKER_USERS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Set Trading Account as Invalid',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_BULK_INVALIDATE_BROKER_USERS',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'Can bulk set Trading Account as Invalid',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_TRADING_ACCOUNT_ID_COLUMN',

          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'See Trading Account id column',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_VIEW_CLIENT_AREA_TAB',

          category: 'User',
          subCategory: 'Client Area View',
          name: 'View Client Area Tab',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_VIEW_TRADING_ACTIONS',

          category: 'User',
          subCategory: 'Client Area View',
          name: 'View Trading Actions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SET_TRADING_ACTIONS',

          category: 'User',
          subCategory: 'Client Area View',
          name: 'Set Trading Actions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SET_MASS_TRADING_ACTIONS',

          category: 'User',
          subCategory: 'Client Area View',
          name: 'Mass Edit Trading Actions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SET_CLIENT_AREA_SITE',

          category: 'User',
          subCategory: 'Client Area View',
          name: 'Set Client Area',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_VIEW_USER_PSP',

          category: 'User',
          subCategory: 'Client Psp View',
          name: 'View Client Psp',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SET_USER_PSP',

          category: 'User',
          subCategory: 'Client Psp View',
          name: 'Set Client Psp',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_VIEW_MASS_USER_PSP',

          category: 'User',
          subCategory: 'Client Psp View',
          name: 'View Mass Client Psp',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SET_MASS_USER_PSP',

          category: 'User',
          subCategory: 'Client Psp View',
          name: 'Set Mass Client Psp',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_CLIENT_AUDIT_INFO',

          category: 'User',
          subCategory: 'User Audit',
          name: 'Update User Audit Info',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_USER_AUDIT_INFO',

          category: 'User',
          subCategory: 'User Audit',
          name: 'See User Audit Info',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_USER_BANKING',

          category: 'System',
          subCategory: 'User Banking',
          name: 'Update user banking',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_USER_BANKING',

          category: 'System',
          subCategory: 'User Banking',
          name: 'Read user banking',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_BROKER_BANKINGS',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Read Transactions',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'UPDATE_BROKER_BANKINGS',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Update Transactions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_BULK_UPDATE_BROKER_BANKINGS',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Can Bulk Update Transactions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_REVERT_BROKER_BANKINGS_TO_PENDING',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Can revert Transactions to pending',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_BANKING_WITHDRAWAL_REASON',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Set Transaction Withdrawal Reason',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_BANKING_USER_COMMENT',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Set Transaction User Comment',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_BANKING_ORIGINAL_VALUES',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Set Transaction Original Values',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_BANKING_IS_HIDDEN_FROM_AFFILIATE',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Set Transaction Reset Settings',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'CAN_CHARGE_NEGATIVE_FEE',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Can Charge Negative Fee',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_CHARGE_FEE',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Can Charge Fee',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_BROKER_BANKING_PSP_NAME_MATCH',

          category: 'User',
          subCategory: 'Transactions',
          name: 'See Transaction PSP name match',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_BANKING_PSP_NAME_MATCH',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Set Transaction PSP name match',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_BANKING_BIN_COUNTRY',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Set Transaction BIN Country',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_BANKING_WITHDRAWAL_PROCESS_WD_TEAM_STATUS',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Set Broker Banking Withdrawal Process Wd Team Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_BANKING_WITHDRAWAL_PROCESS_SALES_TEAM_STATUS',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Set Broker Banking Withdrawal Process Sales Team Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_BANKING_WITHDRAWAL_PROCESS_SALES_REP_STATUS',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Set Broker Banking Withdrawal Process Sales Rep Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_BANKING_WITHDRAWAL_PROCESS_SALES_MANAGER_STATUS',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Set Broker Banking Withdrawal Process Sales Manager Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_BANKING_WITHDRAWAL_PROCESS_DEALING_STATUS',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Set Broker Banking Withdrawal Process Dealing Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_BANKING_WITHDRAWAL_PROCESS_FINANCE_STATUS',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Set Broker Banking Withdrawal Process Finance Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_BANKING_WITHDRAWAL_PROCESS_CY_OPS_STATUS',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Set Broker Banking Withdrawal Process Cy Ops Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_BROKER_BANKING_WITHDRAWAL_PROCESS_PAYMENT_TEAM_STATUS',

          category: 'User',
          subCategory: 'Transactions',
          name: 'Set Broker Banking Withdrawal Process Payment Team Status',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_REBATES_TRADES',

          category: 'User',
          subCategory: 'Rebates Trades',
          name: 'Read rebates trades',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_OPERATORS',

          category: 'System',
          subCategory: 'Operators',
          name: 'Create Operators',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'READ_OPERATORS',
          type: 'Scoped',
          category: 'System',
          subCategory: 'Operators',
          name: 'Read Operators',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'UPDATE_OPERATORS',

          category: 'System',
          subCategory: 'Operators',
          name: 'Update Operators',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'DELETE_OPERATORS',

          category: 'System',
          subCategory: 'Operators',
          name: 'Delete Operators',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'CAN_RECEIVE_INVESTMENT_QUESTIONNAIRE_SUBMITTED_TASK',

          category: 'System',
          subCategory: 'Operators',
          name: 'Can Receive Investment Questionnaire Submitted Task',
          description:
            "Roles with this permission add their operators to the pool of possible assignees for the Investment 'Questionnaire Submitted' task",
          readOnly: false,
        },
        {
          key: 'CAN_RECEIVE_QUESTIONNAIRE_SUBMITTED_TASK',

          category: 'System',
          subCategory: 'Operators',
          name: 'Can Receive Questionnaire Submitted Task',
          description:
            "Roles with this permission add their operators to the pool of possible assignees for the 'Questionnaire Submitted' task",
          readOnly: false,
        },
        {
          key: 'CAN_RECEIVE_KYC_UPLOADED_TASK',

          category: 'System',
          subCategory: 'Operators',
          name: 'Can Receive Kyc Uploaded Task',
          description:
            "Roles with this permission add their operators to the pool of possible assignees for the 'KYC document uploaded' task",
          readOnly: false,
        },
        {
          key: 'CAN_RECEIVE_TRANSFER_REQUESTED_TASK',

          category: 'System',
          subCategory: 'Operators',
          name: 'Can Receive Transfer Requested Task',
          description:
            "Roles with this permission add their operators to the pool of possible assignees for the 'Transfer Between Trading Accounts' task",
          readOnly: false,
        },
        {
          key: 'CAN_RECEIVE_WITHDRAWAL_REQUESTED_TASK',

          category: 'System',
          subCategory: 'Operators',
          name: 'Can Receive Withdrawal Requested Task',
          description:
            "Roles with this permission add their operators to the pool of possible assignees for the 'Withdrawal requested' task",
          readOnly: false,
        },
        {
          key: 'CAN_RECEIVE_REFUND_REQUESTED_TASK',

          category: 'System',
          subCategory: 'Operators',
          name: 'Can Receive Refund Requested Task',
          description:
            "Roles with this permission add their operators to the pool of possible assignees for the 'Refund requested' task",
          readOnly: false,
        },
        {
          key: 'CAN_RECEIVE_ASSISTANCE_WITH_DOCUMENTS_TASK',

          category: 'System',
          subCategory: 'Operators',
          name: 'Can Receive Assistance With Documents Task',
          description:
            "Roles with this permission add their operators to the pool of possible assignees for the 'Assistance In Documents' task",
          readOnly: false,
        },
        {
          key: 'SEE_TEST_OPERATORS',

          category: 'System',
          subCategory: 'Operators',
          name: 'See Test Operators',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_INACTIVE_OPERATORS',

          category: 'System',
          subCategory: 'Operators',
          name: 'See Inactive Operators',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_OPERATOR_BYPASS_IP_WHITELIST',

          category: 'System',
          subCategory: 'Operators',
          name: 'Set Operator Bypass Ip Whitelist',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_OPERATOR_ROLE',

          category: 'System',
          subCategory: 'Operators',
          name: 'Set Operator Role',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_OPERATOR_ACTIVE',

          category: 'System',
          subCategory: 'Operators',
          name: 'Set Operator Active',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_OPERATOR_EMAIL',

          category: 'System',
          subCategory: 'Operators',
          name: 'Set Operator Email',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_OPERATOR_MAILING_CREDENTIALS',

          category: 'System',
          subCategory: 'Operators',
          name: "Set Operator's IMAP and SMTP credentials",
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_OPERATOR_APP_ID',

          category: 'System',
          subCategory: 'Operators',
          name: 'Set Operator App',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_OPERATOR_IS_TEST',

          category: 'System',
          subCategory: 'Operators',
          name: 'Set Test Operator',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_GENERATE_OPERATOR_DASHBOARD',

          category: 'System',
          subCategory: 'Operators',
          name: 'Can Generate Operator Dashboard',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_LOGIN_AS_OPERATOR',

          category: 'System',
          subCategory: 'Operators',
          name: 'Can Login As Operator',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'CAN_RESET_TOTP',

          category: 'System',
          subCategory: 'Operators',
          name: 'Can Reset Totp',
          description: 'Can Reset the TOTP key',
          readOnly: false,
        },
        {
          key: 'SEE_OPERATOR_TOTP_QR_CODE',

          category: 'System',
          subCategory: 'Operators',
          name: 'See Operator Totp Qr Code',
          description:
            'Roles with this permission can see the QR code of operators',
          readOnly: true,
        },
        {
          key: 'CAN_RESET_ALL_TOTP',

          category: 'System',
          subCategory: 'Operators',
          name: 'Can Reset All Totp',
          description:
            'Roles with this permission can bulk reset all TOTP keys',
          readOnly: false,
        },
        {
          key: 'CAN_BULK_FORCE_OPERATOR_PASSWORD_CHANGE',

          category: 'System',
          subCategory: 'Operators',
          name: 'Can Bulk Force Operator Password Change',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_BLOCK_OPERATORS',

          category: 'System',
          subCategory: 'Operators',
          name: 'Can Block Operators',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_BULK_UPDATE_OPERATORS',

          category: 'System',
          subCategory: 'Operators',
          name: 'Can Bulk Update Operators',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_OFFICES',

          category: 'System',
          subCategory: 'Offices',
          name: 'Create Offices',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'READ_OFFICES',

          category: 'System',
          subCategory: 'Offices',
          name: 'Read Offices',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'UPDATE_OFFICES',

          category: 'System',
          subCategory: 'Offices',
          name: 'Update Offices',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'DELETE_OFFICES',

          category: 'System',
          subCategory: 'Offices',
          name: 'Delete Offices',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'CREATE_AFFILIATES',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Create Affiliates',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'READ_AFFILIATES',
          type: 'Scoped',
          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Read Affiliates',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'UPDATE_AFFILIATES',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Update Affiliates',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'DELETE_AFFILIATES',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Delete Affiliates',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'CAN_MANAGE_AFFILIATES',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Can Manage Affiliates',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_AFFILIATE_API_LOG',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Read Affiliate Api Log',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SEE_FULL_REGISTRATION_ERROR',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Can See Full Registration Error',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_AFFILIATE_DASHBOARD',

          category: 'Affiliate',
          subCategory: 'Miscellaneous',
          name: 'See Affiliate Dashboard',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_AFFILIATE_KYC_STATUS',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Set Affiliate Kyc Status',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SET_AFFILIATE_DELETED',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Set Affiliate Deleted',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_AFFILIATE_BYPASS_IP_WHITELIST',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Set Affiliate Bypass Ip Whitelist',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_AFFILIATE_MANAGER',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Set Affiliate Manager',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_AFFILIATE_APP',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Set Affiliate App',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_AFFILIATE_MIN_DEPOSIT_AMOUNT',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Set Affiliate Min Deposit Amount',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_AFFILIATE_OFFERS',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'See Affiliate Offers',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_AFFILIATE_REGULATED',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'See Affiliate Regulated',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_PROMO_TEMPLATE',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Create Promo Template',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_PROMO_TEMPLATE',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Read Promo Template',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_PROMO_TEMPLATE',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Update Promo Template',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_PROMO_TEMPLATE',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Delete Promo Template',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SYNC_AFFILIATE_WITH_USER',

          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Can Sync Affiliate With User',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_AFFILIATE_LINKS',

          category: 'Affiliate',
          subCategory: 'Affiliate Links',
          name: 'Create Affiliate Links',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'READ_AFFILIATE_LINKS',

          category: 'Affiliate',
          subCategory: 'Affiliate Links',
          name: 'Read Affiliate Links',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_AFFILIATE_LINKS',

          category: 'Affiliate',
          subCategory: 'Affiliate Links',
          name: 'Update Affiliate Links',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_AFFILIATE_LINKS',

          category: 'Affiliate',
          subCategory: 'Affiliate Links',
          name: 'Delete Affiliate Links',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_UNPUBLISHED_AFFILIATE_LINKS',

          category: 'Affiliate',
          subCategory: 'Affiliate Links',
          name: 'See Unpublished Affiliate Links',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_AFFILIATE_LINK_REGULATED',

          category: 'Affiliate',
          subCategory: 'Affiliate Links',
          name: 'See Affiliate Link Regulated',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_AFFILIATE_API_DOCUMENTATION',

          category: 'Affiliate',
          subCategory: 'Miscellaneous',
          name: 'See Affiliate Api Documentation',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_AFFILIATE_PIXELS',

          category: 'Affiliate',
          subCategory: 'Affiliate Pixels',
          name: 'Create Affiliate Pixels',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_AFFILIATE_PIXELS',

          category: 'Affiliate',
          subCategory: 'Affiliate Pixels',
          name: 'Read Affiliate Pixels',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_AFFILIATE_PIXELS',

          category: 'Affiliate',
          subCategory: 'Affiliate Pixels',
          name: 'Update Affiliate Pixels',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_AFFILIATE_PIXELS',

          category: 'Affiliate',
          subCategory: 'Affiliate Pixels',
          name: 'Delete Affiliate Pixels',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_AFFILIATE_PIXEL_LOGS',

          category: 'Affiliate',
          subCategory: 'Affiliate Pixels',
          name: 'See Affiliate Pixel Logs',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_AFFILIATE_APP_RELS',

          category: 'Affiliate',
          subCategory: 'Affiliate Offers',
          name: 'Create Affiliate App Rels',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_AFFILIATE_APP_RELS',

          category: 'Affiliate',
          subCategory: 'Affiliate Offers',
          name: 'Read Affiliate App Rels',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_AFFILIATE_APP_RELS',

          category: 'Affiliate',
          subCategory: 'Affiliate Offers',
          name: 'Update Affiliate App Rels',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_AFFILIATE_APP_RELS',

          category: 'Affiliate',
          subCategory: 'Affiliate Offers',
          name: 'Delete Affiliate App Rels',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_AFFILIATE_BANKINGS',

          category: 'Affiliate',
          subCategory: 'Affiliate Transactions',
          name: 'Read Affiliate Transactions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_AFFILIATE_BANKINGS',

          category: 'Affiliate',
          subCategory: 'Affiliate Transactions',
          name: 'Update Affiliate Transactions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_DISPUTE_AFFILIATE_BANKINGS',

          category: 'Affiliate',
          subCategory: 'Affiliate Transactions',
          name: 'Dispute Affiliate Transactions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_APPROVE_AFFILIATE_BANKINGS',

          category: 'Affiliate',
          subCategory: 'Affiliate Transactions',
          name: 'Approve Affiliate Transactions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_CANCEL_AFFILIATE_BANKINGS',

          category: 'Affiliate',
          subCategory: 'Affiliate Transactions',
          name: 'Cancel Affiliate Transactions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_REJECT_AFFILIATE_BANKINGS',

          category: 'Affiliate',
          subCategory: 'Affiliate Transactions',
          name: 'Reject Affiliate Transactions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_BULK_UPDATE_AFFILIATE_BANKINGS',

          category: 'Affiliate',
          subCategory: 'Affiliate Transactions',
          name: 'Bulk update Affiliate Transactions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_AFFILIATE_PAYOUTS',

          category: 'Affiliate',
          subCategory: 'Affiliate Payouts',
          name: 'Create Affiliate Payouts',
          description: 'Create Affiliate Payouts (Manager role permission)',
          readOnly: true,
        },
        {
          key: 'CREATE_AFFILIATE_PAYOUTS_WITHDRAWAL_REQUESTS',

          category: 'Affiliate',
          subCategory: 'Affiliate Payouts',
          name: 'Create Affiliate Payouts Withdrawal Requests',
          description:
            'Create pending affiliate withdrawal requests for himself only (Affiliate role permission)',
          readOnly: false,
        },
        {
          key: 'CAN_CANCEL_OWN_AFFILIATE_PAYOUTS',

          category: 'Affiliate',
          subCategory: 'Affiliate Payouts',
          name: 'Can Cancel Own Affiliate Payouts',
          description:
            'Cancel pending affiliate withdrawal requests for himself only (Affiliate role permission)',
          readOnly: false,
        },
        {
          key: 'READ_AFFILIATE_PAYOUTS',

          category: 'Affiliate',
          subCategory: 'Affiliate Payouts',
          name: 'Read Affiliate Payouts',
          description: 'Read all Affiliate Payouts (Manager role permission)',
          readOnly: true,
        },
        {
          key: 'READ_OWN_AFFILIATE_PAYOUTS',

          category: 'Affiliate',
          subCategory: 'Affiliate Payouts',
          name: 'Read Own Affiliate Payouts',
          description:
            'Read his own affiliate withdrawal requests (Affiliate role permission)',
          readOnly: false,
        },
        {
          key: 'UPDATE_AFFILIATE_PAYOUTS',

          category: 'Affiliate',
          subCategory: 'Affiliate Payouts',
          name: 'Update Affiliate Payouts',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'CAN_APPROVE_AFFILIATE_PAYOUTS',

          category: 'Affiliate',
          subCategory: 'Affiliate Payouts',
          name: 'Can Approve Affiliate Payouts',
          description: 'Approve Affiliate Payouts',
          readOnly: true,
        },
        {
          key: 'CAN_CANCEL_AFFILIATE_PAYOUTS',

          category: 'Affiliate',
          subCategory: 'Affiliate Payouts',
          name: 'Can Cancel Affiliate Payouts',
          description: 'Cancel Affiliate Payouts',
          readOnly: true,
        },
        {
          key: 'SET_AFFILIATE_PAYOUT_TEST',

          category: 'Affiliate',
          subCategory: 'Affiliate Payouts',
          name: 'Set Affiliate Payout Test',
          description: 'Set Affiliate Payouts To Test',
          readOnly: false,
        },
        {
          key: 'CAN_BULK_APPROVE_AFFILIATE_PAYOUTS',

          category: 'Affiliate',
          subCategory: 'Affiliate Payouts',
          name: 'Can Bulk Approve Affiliate Payouts',
          description: 'Can bulk approve Affiliate Payouts',
          readOnly: true,
        },
        {
          key: 'CREATE_BROKERS',

          category: 'Broker',
          subCategory: 'Brokers',
          name: 'Create Brokers',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_BROKERS',

          category: 'Broker',
          subCategory: 'Brokers',
          name: 'Read Brokers',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_BROKERS',

          category: 'Broker',
          subCategory: 'Brokers',
          name: 'Update Brokers',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_BROKERS',

          category: 'Broker',
          subCategory: 'Brokers',
          name: 'Delete Brokers',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_TEST_BROKERS',

          category: 'Broker',
          subCategory: 'General',
          name: 'Can Test Brokers',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_BROKER_DASHBOARD',

          category: 'Broker',
          subCategory: 'General',
          name: 'See Broker Dashboard',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_CHECK_BROKER_SYSTEM_STATUS',

          category: 'Broker',
          subCategory: 'Brokers',
          name: 'Can Check Broker System Status',
          description:
            "Roles with this permission can check a given integration/advertiser's system status, where supported",
          readOnly: false,
        },
        {
          key: 'CAN_DEPOSIT_TEST_CREDIT_TO_BROKER',

          category: 'Broker',
          subCategory: 'Brokers',
          name: 'Can Deposit Test Credit To Broker',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SEE_DELETED_BROKERS',

          category: 'Broker',
          subCategory: 'Brokers',
          name: 'Can See Deleted Brokers',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_DELETED_BROKERS',

          category: 'Broker',
          subCategory: 'Brokers',
          name: 'Can Update Deleted Brokers',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_ADVERTISERS',

          category: 'Advertiser',
          subCategory: 'Advertisers',
          name: 'Read Advertisers',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_ADVERTISERS',

          category: 'Advertiser',
          subCategory: 'Advertisers',
          name: 'Create Advertisers',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_ADVERTISERS',

          category: 'Advertiser',
          subCategory: 'Advertisers',
          name: 'Update Advertisers',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_ADVERTISERS',

          category: 'Advertiser',
          subCategory: 'Advertisers',
          name: 'Delete Advertisers',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_MANAGE_ADVERTISERS',

          category: 'Advertiser',
          subCategory: 'Advertisers',
          name: 'Can Manage Advertisers',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_OWN_ADVERTISER_INFO',

          category: 'Advertiser',
          subCategory: 'Advertiser',
          name: 'Read Own Advertiser Info',
          description: 'Created for MSQ advertisers portal',
          readOnly: false,
        },
        {
          key: 'READ_ADVERTISER_PAYMENTS',

          category: 'Advertiser',
          subCategory: 'Advertisers',
          name: 'Read Advertiser Payments',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_ADVERTISER_PAYMENTS',

          category: 'Advertiser',
          subCategory: 'Advertisers',
          name: 'Create Advertiser Payments',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_ADVERTISER_PAYMENTS',

          category: 'Advertiser',
          subCategory: 'Advertisers',
          name: 'Update Advertiser Payments',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_ADVERTISER_PAYMENTS',

          category: 'Advertiser',
          subCategory: 'Advertisers',
          name: 'Delete Advertiser Payments',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_APPROVE_ADVERTISER_PAYMENTS',

          category: 'Advertiser',
          subCategory: 'Advertisers',
          name: 'Can Approve Advertiser Payments',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_CANCEL_ADVERTISER_PAYMENTS',

          category: 'Advertiser',
          subCategory: 'Advertisers',
          name: 'Can Cancel Advertiser Payments',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_ACTIVITY_LOGS',

          category: 'General',
          subCategory: 'Activity Log',
          name: 'Read Activity Logs',
          description:
            'Roles with this permission can read the activity logs of all entities they have read access to',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'CAN_RESTORE_ACTIVITY_LOGS',

          category: 'General',
          subCategory: 'Activity Log',
          name: 'Can Restore Activity Logs',
          description:
            'Roles with this permission can restore activity logs from the archiver, where supported',
          readOnly: false,
        },
        {
          key: 'CREATE_APPS',

          category: 'System',
          subCategory: 'Apps',
          name: 'Create Apps',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_APPS',

          category: 'System',
          subCategory: 'Apps',
          name: 'Read Apps',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_APPS',

          category: 'System',
          subCategory: 'Apps',
          name: 'Update Apps',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_PROCESS_QUEUES',

          category: 'System',
          subCategory: 'Process Queues',
          name: 'Read Process Queues',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_CANCEL_PROCESS_QUEUES',

          category: 'System',
          subCategory: 'Process Queues',
          name: 'Can Cancel Process Queues',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_REVIEWS',

          category: 'General',
          subCategory: 'Reviews',
          name: 'Create Reviews',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_REVIEWS',

          category: 'General',
          subCategory: 'Reviews',
          name: 'Read Reviews',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_REVIEWS',

          category: 'General',
          subCategory: 'Reviews',
          name: 'Update Reviews',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_KEYWORDS',

          category: 'General',
          subCategory: 'Keywords',
          name: 'Create Keywords',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_KEYWORDS',

          category: 'General',
          subCategory: 'Keywords',
          name: 'Read Keywords',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_KEYWORDS',

          category: 'General',
          subCategory: 'Keywords',
          name: 'Update Keywords',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_KEYWORDS',

          category: 'General',
          subCategory: 'Keywords',
          name: 'Delete Keywords',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_PROMOTIONS',

          category: 'General',
          subCategory: 'Promotions',
          name: 'Read Promotions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_SEND_PROMOTIONS',

          category: 'General',
          subCategory: 'Promotions',
          name: 'Can Send Promotions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_CONTENT',

          category: 'General',
          subCategory: 'Content',
          name: 'Read Content',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_CONTENT',

          category: 'General',
          subCategory: 'Content',
          name: 'Create Content',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_CONTENT',

          category: 'General',
          subCategory: 'Content',
          name: 'Update Content',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_CONTENT',

          category: 'General',
          subCategory: 'Content',
          name: 'Delete Content',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_CONTENT_LINK',

          category: 'General',
          subCategory: 'Content Link',
          name: 'Read Content Link',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_CONTENT_LINK',

          category: 'General',
          subCategory: 'Content Link',
          name: 'Create Content Link',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_CONTENT_LINK',

          category: 'General',
          subCategory: 'Content Link',
          name: 'Update Content Link',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_CONTENT_LINK',

          category: 'General',
          subCategory: 'Content Link',
          name: 'Delete Content Link',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_CONTENT_GROUPS',

          category: 'General',
          subCategory: 'Content Groups',
          name: 'Read Content Groups',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_CONTENT_GROUPS',

          category: 'General',
          subCategory: 'Content Groups',
          name: 'Create Content Groups',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_CONTENT_GROUPS',

          category: 'General',
          subCategory: 'Content Groups',
          name: 'Update Content Groups',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_CONTENT_GROUPS',

          category: 'General',
          subCategory: 'Content Groups',
          name: 'Delete Content Groups',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_PAYMENTS',

          category: 'System',
          subCategory: 'Payments',
          name: 'Read Payments',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_SCHEDULED_REPORTS',

          category: 'General',
          subCategory: 'Scheduled Reports',
          name: 'Create Scheduled Reports',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_SCHEDULED_REPORTS',

          category: 'General',
          subCategory: 'Scheduled Reports',
          name: 'Read Scheduled Reports',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_SCHEDULED_REPORTS',

          category: 'General',
          subCategory: 'Scheduled Reports',
          name: 'Update Scheduled Reports',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_SCHEDULED_REPORTS',

          category: 'General',
          subCategory: 'Scheduled Reports',
          name: 'Delete Scheduled Reports',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_EXECUTE_SCHEDULED_REPORTS',

          category: 'General',
          subCategory: 'Scheduled Reports',
          name: 'Can Execute Scheduled Reports',
          description:
            'Roles with this permission can manually execute scheduled reports',
          readOnly: false,
        },
        {
          key: 'CREATE_USER_SCHEDULED_ACTIONS',

          category: 'General',
          subCategory: 'User Scheduled Actions',
          name: 'Create User Scheduled Actions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_USER_SCHEDULED_ACTIONS',

          category: 'General',
          subCategory: 'User Scheduled Actions',
          name: 'Read User Scheduled Actions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_USER_SCHEDULED_ACTIONS',

          category: 'General',
          subCategory: 'User Scheduled Actions',
          name: 'Update User Scheduled Actions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_USER_SCHEDULED_ACTIONS',

          category: 'General',
          subCategory: 'User Scheduled Actions',
          name: 'Delete User Scheduled Actions',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_EXECUTE_SCHEDULED_ACTIONS',

          category: 'General',
          subCategory: 'User Scheduled Actions',
          name: 'Can Execute Scheduled Actions',
          description:
            'Roles with this permission can manually execute user scheduled actions',
          readOnly: false,
        },
        {
          key: 'CREATE_PARAMETERS',

          category: 'System',
          subCategory: 'Parameters',
          name: 'Create Parameters',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_PARAMETERS',

          category: 'System',
          subCategory: 'Parameters',
          name: 'Read Parameters',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_PARAMETERS',

          category: 'System',
          subCategory: 'Parameters',
          name: 'Update Parameters',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_PARAMETERS',

          category: 'System',
          subCategory: 'Parameters',
          name: 'Delete Parameters',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_UPDATE_READ_ONLY_PARAMETERS',

          category: 'System',
          subCategory: 'Parameters',
          name: 'Can Update Read Only Parameters',
          description: 'No description',
          readOnly: true,
        },
        {
          key: 'CREATE_NINJA_PARAMETERS',

          category: 'System',
          subCategory: 'Ninja',
          name: 'Create Ninja Parameters',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_NINJA_PARAMETERS',

          category: 'System',
          subCategory: 'Ninja',
          name: 'Read Ninja Parameters',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_NINJA_PARAMETERS',

          category: 'System',
          subCategory: 'Ninja',
          name: 'Update Ninja Parameters',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_NINJA_PARAMETERS',

          category: 'System',
          subCategory: 'Ninja',
          name: 'Delete Ninja Parameters',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_STRINGS',

          category: 'System',
          subCategory: 'Strings',
          name: 'Create Strings',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_STRINGS',

          category: 'System',
          subCategory: 'Strings',
          name: 'Read Strings',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_STRINGS',

          category: 'System',
          subCategory: 'Strings',
          name: 'Update Strings',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_STRINGS',

          category: 'System',
          subCategory: 'Strings',
          name: 'Delete Strings',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_AUTO_SIGN_DOCS',

          category: 'System',
          subCategory: 'AutoSignDocs',
          name: 'Create Auto Sign Docs',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_AUTO_SIGN_DOCS',

          category: 'System',
          subCategory: 'AutoSignDocs',
          name: 'Read Auto Sign Docs',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_AUTO_SIGN_DOCS',

          category: 'System',
          subCategory: 'AutoSignDocs',
          name: 'Update Auto Sign Docs',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_AUTO_SIGN_DOCS',

          category: 'System',
          subCategory: 'AutoSignDocs',
          name: 'Delete Auto Sign Docs',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_POPUPS',

          category: 'System',
          subCategory: 'Popups',
          name: 'Create Popups',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_POPUPS',

          category: 'System',
          subCategory: 'Popups',
          name: 'Read Popups',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_POPUPS',

          category: 'System',
          subCategory: 'Popups',
          name: 'Update Popups',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_POPUPS',

          category: 'System',
          subCategory: 'Popups',
          name: 'Delete Popups',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_PUBLISH_CUSTOM_FILTERS',

          category: 'General',
          subCategory: 'Grids',
          name: 'Can Publish Custom Filters',
          description:
            'Roles with this permission can publish custom filters to roles',
          readOnly: false,
        },
        {
          key: 'CAN_SELECT_CUSTOM_FILTERS',

          category: 'General',
          subCategory: 'Grids',
          name: 'Can Select Custom Filters',
          description: 'Roles with this permission can choose grid filters',
          readOnly: false,
        },
        {
          key: 'CREATE_KYC_DOCUMENTS',

          category: 'User',
          subCategory: 'KYC Documents',
          name: 'Create Kyc Documents',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'READ_KYC_DOCUMENTS',
          category: 'User',
          subCategory: 'KYC Documents',
          name: 'Read Kyc Documents',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'UPDATE_KYC_DOCUMENTS',

          category: 'User',
          subCategory: 'KYC Documents',
          name: 'Update Kyc Documents',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_KYC_DOCUMENT_URL',

          category: 'User',
          subCategory: 'KYC Documents',
          name: 'See Kyc Document Url',
          description: 'Roles with this permission can see KYC URL / Preview',
          readOnly: false,
        },
        {
          key: 'SEE_KYC_DOCUMENT_STATUS',

          category: 'User',
          subCategory: 'KYC Documents',
          name: 'See Kyc Document Status',
          description:
            'Roles with this permission can see status, approval time , approved by',
          readOnly: false,
        },
        {
          key: 'CAN_APPROVE_KYC_DOCUMENTS',

          category: 'User',
          subCategory: 'KYC Documents',
          name: 'Can Approve Kyc Documents',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_TRANSLATE_KYC_DOCUMENT',

          category: 'User',
          subCategory: 'KYC Documents',
          name: 'Can Translate Kyc Document',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_MAIN_KYC_DOCUMENTS',

          category: 'User',
          subCategory: 'KYC Documents',
          name: 'See Main Kyc Documents',
          description:
            'Roles with this permission can see the primary KYC Documents grid',
          readOnly: false,
        },
        {
          key: 'CAN_APPROVE_KYC_DOCUMENT_TRANSLATION',

          category: 'User',
          subCategory: 'KYC Documents',
          name: 'Can Approve Kyc Document Translation',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_EVENT',

          category: 'Communication',
          subCategory: 'Events',
          name: 'Read Event',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_EVENT_COMMUNICATION_TYPES',

          category: 'Communication',
          subCategory: 'Event Communication Types',
          name: 'Read Event Communication Types',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_EVENT_COMMUNICATION_TYPES',

          category: 'Communication',
          subCategory: 'Event Communication Types',
          name: 'Update Event Communication Types',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_EVENT_COMMUNICATION_TYPES',

          category: 'Communication',
          subCategory: 'Event Communication Types',
          name: 'Create Event Communication Types',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_EVENT_COMMUNICATION_TYPES',

          category: 'Communication',
          subCategory: 'Event Communication Types',
          name: 'Delete Event Communication Types',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_EVENT_TEMPLATES',

          category: 'Communication',
          subCategory: 'Event Templates',
          name: 'Read Event Templates',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_EVENT_TEMPLATES',

          category: 'Communication',
          subCategory: 'Event Templates',
          name: 'Update Event Templates',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_EVENT_TEMPLATES',

          category: 'Communication',
          subCategory: 'Event Templates',
          name: 'Delete Event Templates',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_EVENT_TEMPLATES',

          category: 'Communication',
          subCategory: 'Event Templates',
          name: 'Create Event Templates',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_COMMUNICATION_INTEGRATIONS',

          category: 'Communication',
          subCategory: 'Integrations',
          name: 'Read Communication Integrations',
          description: 'Read integrations',
          readOnly: false,
        },
        {
          key: 'UPDATE_COMMUNICATION_INTEGRATIONS',

          category: 'Communication',
          subCategory: 'Integrations',
          name: 'Update Communication Integrations',
          description: 'Update integrations',
          readOnly: false,
        },
        {
          key: 'CREATE_COMMUNICATION_INTEGRATIONS',

          category: 'Communication',
          subCategory: 'Integrations',
          name: 'Create Communication Integrations',
          description: 'Create integrations',
          readOnly: false,
        },
        {
          key: 'DELETE_COMMUNICATION_INTEGRATIONS',

          category: 'Communication',
          subCategory: 'Integrations',
          name: 'Delete Communication Integrations',
          description: 'Delete existing',
          readOnly: false,
        },
        {
          key: 'UPDATE_COUNTRY_INTEGRATION_REL',

          category: 'Communication',
          subCategory: 'Country Integration Rel',
          name: 'Update Country Integration Rel',
          description: 'Update Country Integration Rel',
          readOnly: false,
        },
        {
          key: 'UPDATE_COMMUNICATION_QUICK_MESSAGES',

          category: 'Communication',
          subCategory: 'Quick Messages',
          name: 'Update Communication Quick Messages',
          description: 'Update Quick Messages',
          readOnly: false,
        },
        {
          key: 'CREATE_COMMUNICATION_QUICK_MESSAGES',

          category: 'Communication',
          subCategory: 'Quick Messages',
          name: 'Create Communication Quick Messages',
          description: 'Create Quick Messages',
          readOnly: false,
        },
        {
          key: 'DELETE_COMMUNICATION_QUICK_MESSAGES',

          category: 'Communication',
          subCategory: 'Quick Messages',
          name: 'Delete Communication Quick Messages',
          description: 'Delete Quick Messages',
          readOnly: false,
        },
        {
          key: 'READ_COMMUNICATION_QUICK_MESSAGES',

          category: 'Communication',
          subCategory: 'Quick Messages',
          name: 'Read Communication Quick Messages',
          description: 'Read all Quick Messages',
          readOnly: false,
        },
        {
          key: 'CREATE_COMMUNICATION_PARAMETERS',

          category: 'Communication',
          subCategory: 'Parameters',
          name: 'Create Communication Parameters',
          description: 'Create parameters',
          readOnly: false,
        },
        {
          key: 'READ_COMMUNICATION_PARAMETERS',

          category: 'Communication',
          subCategory: 'Parameters',
          name: 'Read Communication Parameters',
          description: 'Read parameters',
          readOnly: false,
        },
        {
          key: 'UPDATE_COMMUNICATION_PARAMETERS',

          category: 'Communication',
          subCategory: 'Parameters',
          name: 'Update Communication Parameters',
          description: 'Update parameters',
          readOnly: false,
        },
        {
          key: 'DELETE_COMMUNICATION_PARAMETERS',

          category: 'Communication',
          subCategory: 'Parameters',
          name: 'Delete Communication Parameters',
          description: 'Delete parameters',
          readOnly: false,
        },
        {
          key: 'CAN_GENERATE_END_OF_DAY_REPORT',

          category: 'General',
          subCategory: 'Reports',
          name: 'Can Generate End Of Day Report',
          description:
            'Roles with this permission can generate the End of Day report',
          readOnly: false,
        },
        {
          key: 'SEE_AGENT_PERFORMANCE_REPORT',

          category: 'General',
          subCategory: 'Reports',
          name: 'See Agent Performance Report',
          description:
            'Roles with this permission can view the Agent Performance Report',
          readOnly: false,
        },
        {
          key: 'CAN_EXPORT_AGENT_PERFORMANCE_REPORT',

          category: 'General',
          subCategory: 'Reports',
          name: 'Can Export Agent Performance Report',
          description:
            'Roles with this permission can export the Agent Performance Report',
          readOnly: false,
        },
        {
          key: 'SEE_HELPDESK',

          category: 'General',
          subCategory: 'Miscellaneous',
          name: 'See Helpdesk',
          description:
            'Roles with this permission can view the helpdesk button',
          readOnly: false,
        },
        {
          key: 'READ_REPORTS',

          category: 'General',
          subCategory: 'Reports',
          name: 'Read Reports',
          description:
            'Roles with this permission can see reports relevant to their role',
          readOnly: false,
        },
        {
          key: 'READ_MENU_ITEMS',

          category: 'System',
          subCategory: 'Menu Items',
          name: 'Read Menu Items',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_MENU_ITEMS',

          category: 'System',
          subCategory: 'Menu Items',
          name: 'Update Menu Items',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_MENU_ITEMS',

          category: 'System',
          subCategory: 'Menu Items',
          name: 'Create Menu Items',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_MENU_ITEMS',

          category: 'System',
          subCategory: 'Menu Items',
          name: 'Delete Menu Items',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_CRM_API_TOKEN',

          category: 'System',
          subCategory: 'Crm API Token',
          name: 'Create Crm Api Token',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_CRM_API_TOKEN',

          category: 'System',
          subCategory: 'Crm API Token',
          name: 'Read Crm Api Token',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_CRM_API_TOKEN',

          category: 'System',
          subCategory: 'Crm API Token',
          name: 'Update Crm Api Token',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_CRM_API_TOKEN',

          category: 'System',
          subCategory: 'Crm API Token',
          name: 'Delete Crm Api Token',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_WEB_ASSETS',

          category: 'Affiliate',
          subCategory: 'Web Assets',
          name: 'Create Web Assets',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WEB_ASSETS',

          category: 'Affiliate',
          subCategory: 'Web Assets',
          name: 'Read Web Assets',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_WEB_ASSETS',

          category: 'Affiliate',
          subCategory: 'Web Assets',
          name: 'Update Web Assets',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_WEB_ASSETS',

          category: 'Affiliate',
          subCategory: 'Web Assets',
          name: 'Delete Web Assets',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SET_WEB_ASSET_AFFILIATE_ID',

          category: 'Affiliate',
          subCategory: 'Web Assets',
          name: 'Set Web Asset Affiliate Id',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_USER_COUPONS',

          category: 'User',
          subCategory: 'User Coupons',
          name: 'Read User Coupons',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_COUPONS',

          category: 'System',
          subCategory: 'Coupons',
          name: 'Read Coupons',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_COUPONS',

          category: 'System',
          subCategory: 'Coupons',
          name: 'Create Coupons',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_COUPONS',

          category: 'System',
          subCategory: 'Coupons',
          name: 'Update Coupons',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_COUPONS',

          category: 'System',
          subCategory: 'Coupons',
          name: 'Delete Coupons',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_USER_APPLICATION',

          category: 'User',
          subCategory: 'User Application',
          name: 'Create User Application',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_USER_APPLICATION',

          category: 'User',
          subCategory: 'User Application',
          name: 'Read User Application',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_USER_APPLICATION',

          category: 'User',
          subCategory: 'User Application',
          name: 'Update User Application',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_USER_APPLICATION',

          category: 'User',
          subCategory: 'User Application',
          name: 'Delete User Application',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_AFFILIATE_APPLICATION',

          category: 'Affiliate',
          subCategory: 'Affiliate Application',
          name: 'Create Affiliate Application',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_AFFILIATE_APPLICATION',

          category: 'Affiliate',
          subCategory: 'Affiliate Application',
          name: 'Read Affiliate Application',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_AFFILIATE_APPLICATION',

          category: 'Affiliate',
          subCategory: 'Affiliate Application',
          name: 'Update Affiliate Application',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_AFFILIATE_APPLICATION',

          category: 'Affiliate',
          subCategory: 'Affiliate Application',
          name: 'Delete Affiliate Application',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_USER_TERMINATION_REQUEST',

          category: 'User',
          subCategory: 'User Application',
          name: 'Create User Termination Request',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_USER_TERMINATION_REQUEST',

          category: 'User',
          subCategory: 'User Application',
          name: 'Read User Termination Request',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_USER_TERMINATION_REQUEST',

          category: 'User',
          subCategory: 'User Application',
          name: 'Update User Termination Request',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_USER_TERMINATION_REQUEST',

          category: 'User',
          subCategory: 'User Application',
          name: 'Delete User Termination Request',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_AFFILIATE_FEES',

          category: 'Affiliate',
          subCategory: 'Affiliate Fees',
          name: 'Create Affiliate Fees',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_AFFILIATE_FEES',

          category: 'Affiliate',
          subCategory: 'Affiliate Fees',
          name: 'Read Affiliate Fees',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_AFFILIATE_FEES',

          category: 'Affiliate',
          subCategory: 'Affiliate Fees',
          name: 'Update Affiliate Fees',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_AFFILIATE_FEES',
          category: 'Affiliate',
          subCategory: 'Affiliate Fees',
          name: 'Delete Affiliate Fees',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_USER_STAGES_TAB',
          category: 'User',
          subCategory: 'User Stage Tab',
          name: 'Update User Stages Tab',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_USER_STAGES_TAB',
          category: 'User',
          subCategory: 'User Stage Tab',
          name: 'Read User Stages Tab',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_GROUPED_USER_DATA',
          category: 'User',
          subCategory: 'Grouped User Data',
          name: 'Read Grouped User Data',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_OPERATOR_AUDIT_LOG',
          category: 'System',
          subCategory: 'OperatorAuditLog',
          name: 'Read Operator Audit Log',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_TRANSLATION',
          category: 'System',
          subCategory: 'Translation',
          name: 'Read Translation',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_TRANSLATION',
          category: 'System',
          subCategory: 'Translation',
          name: 'Create Translation',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'UPDATE_TRANSLATION',

          category: 'System',
          subCategory: 'Translation',
          name: 'Update Translation',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DELETE_TRANSLATION',

          category: 'System',
          subCategory: 'Translation',
          name: 'Delete Translation',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_Registration',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Registration',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_EndOfDayReport',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'End Of Day Report',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesClientInDeskDeposited',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Client In Desk Deposited',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientDepositedWithOperator',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Deposited With Operator',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_RetentionClientInDeskWithdrawalApproved',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Retention Client In Desk Withdrawal Approved',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesClientInDeskWithdrawalApproved',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Client In Desk Withdrawal Approved',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_RetentionClientInDeskDeposited',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Retention Client In Desk Deposited',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_RetentionClientRequestedWithdrawal',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Retention Client Requested Withdrawal',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ComplianceNonVerifiedClientRequestedWithdrawal',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Compliance Non Verified Client Requested Withdrawal',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientRequestedWithdrawalOverAmount',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Requested Withdrawal Over Amount',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_RetentionClientInDeskRequestedWithdrawal',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Retention Client In Desk Requested Withdrawal',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_RetentionClientInDeskRequestedWithdrawalOverAmount',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Retention Client In Desk Requested Withdrawal Over Amount',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_RetentionClientAssignedToOperator',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Retention Client Assigned To Operator',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesClientAssignedToOperator',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Client Assigned To Operator',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesClientEnteredDepositPage',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Client Entered Deposit Page',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_RetentionClientEnteredDepositPage',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Retention Client Entered Deposit Page',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ComplianceOperatorApprovedClient',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Compliance Operator Approved Client',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_AssignedClientIsOnline',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Assigned Client Is Online',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesClientInDeskIsOnline',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Client In Desk Is Online',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ComplianceNonVerifiedClientIsOnline',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Compliance Non Verified Client Is Online',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_RetentionClientInDeskFlaggedProblematic',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Retention Client In Desk Flagged Problematic',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ComplianceOperatorClientFlaggedProblematic',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Compliance Operator Client Flagged Problematic',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesClientDetailsUpdated',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Client Details Updated',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_RetentionClientDetailsUpdated',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Retention Client Details Updated',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ComplianceNonVerifiedClientMadeNonFTDDeposit',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Compliance Non Verified Client Made Non Ft Ddeposit',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ComplianceClientUploadedFirstDocument',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Compliance Client Uploaded First Document',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_RetentionClientInDeskFlaggedInvalid',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Retention Client In Desk Flagged Invalid',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_RetentionClientInDeskFlaggedReassign',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Retention Client In Desk Flagged Reassign',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ComplianceClientUrgentWithdrawal',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Compliance Client Urgent Withdrawal',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ComplianceOperatorClientUrgentWithdrawal',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Compliance Operator Client Urgent Withdrawal',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_RetentionClientDepositFailed',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Retention Client Deposit Failed',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_RetentionClientInDeskDepositFailed',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Retention Client In Desk Deposit Failed',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesClientDepositFailed',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Client Deposit Failed',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesClientInDeskDepositFailed',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Client In Desk Deposit Failed',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_FreshAffiliateRegisteredClient',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Fresh Affiliate Registered Client',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_AffiliateHasTooManyRegistrationsInTimespan',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Affiliate Has Too Many Registrations In Timespan',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_CallbackEdited',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Callback Edited',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_CallbackDeleted',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Callback Deleted',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_OperatorNotOnlineForCallback',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Operator Not Online For Callback',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ResetTotpDetails',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Reset Totp Details',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_AffiliateRegistration',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Affiliate Registration',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_CallbackMissed',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Callback Missed',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_OperatorBlockedIncorrectLogins',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Operator Blocked Incorrect Logins',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_OperatorBlockedIncorrectOTP',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Operator Blocked Incorrect Ot P',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientKycPriorToRefund',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Kyc Prior To Refund',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SubordinateCallbacksCancelled',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Subordinate Callbacks Cancelled',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_CallbacksCancelled',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Callbacks Cancelled',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_MarginLevel',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Margin Level',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ScheduledReport',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Scheduled Report',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_UpcomingCallback',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Upcoming Callback',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientBirthday',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Birthday',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_IncomingUserCommunication',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Incoming User Communication',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_GoalReachedManager',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Goal Reached Manager',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_GoalReachedOperator',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Goal Reached Operator',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_GridExported',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Grid Exported',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ForgotPassword',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Forgot Password',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_AdvertiserForgotPassword',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Advertiser Forgot Password',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_AffiliateClientDeposited',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Affiliate Client Deposited',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientQuestionnaireSubmitted',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Questionnaire Submitted',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SubordinateQuestionnaireSubmitted',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Subordinate Questionnaire Submitted',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientDepositedOverAmount',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Deposited Over Amount',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_KycTranslatorAssigned',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Kyc Translator Assigned',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_BrokerLastRegistrationCheck',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Broker Last Registration Check',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_UserLastRegistrationCheck',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'User Last Registration Check',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientTradeStoppedOut',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Trade Stopped Out',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_RetentionClientEmailBounced',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Retention Client Email Bounced',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ComplianceClientKycDocumentAboutToExpire',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Compliance Client Kyc Document About To Expire',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ComplianceOperatorClientKycDocumentAboutToExpire',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Compliance Operator Client Kyc Document About To Expire',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_AffiliateOperatorApproved',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Affiliate Operator Approved',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_NewAffiliateRegistered',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'New Affiliate Registered',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientFailedLogin',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Failed Login',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SyncCallbackToCalendar',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sync Callback To Calendar',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SingleClientEmailClicked',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Single Client Email Clicked',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_MultipleClientsEmailClicked',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Multiple Clients Email Clicked',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SingleClientConfigEmailClicked',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Single Client Config Email Clicked',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_MultipleClientsConfigEmailClicked',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Multiple Clients Config Email Clicked',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_LowSeveritySuspiciousLogin',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Low Severity Suspicious Login',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesRepClientDeposited',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Rep Client Deposited',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesClientRequestedWithdrawal',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Client Requested Withdrawal',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesClientRequestedRefund',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Client Requested Refund',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesClientInDeskRequestedWithdrawal',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Client In Desk Requested Withdrawal',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesClientMarginLevel',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Client Margin Level',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesClientInDeskMarginLevel',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Client In Desk Margin Level',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientDepositRequest',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Deposit Request',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_RetentionClientInDeskDepositRequest',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Retention Client In Desk Deposit Request',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesClientInDeskDepositRequest',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Client In Desk Deposit Request',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SalesRepClientDepositRequest',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Sales Rep Client Deposit Request',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SubordinateClientDepositRequest',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Subordinate Client Deposit Request',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ComplianceNonVerifiedClientMadeNonFTDDepositRequest',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Compliance Non Verified Client Made Non Ft Ddeposit Request',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientDepositRequestWithOperator',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Deposit Request With Operator',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientAssigned',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Assigned',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientDeposited',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Deposited',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientDepositFailed',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Deposit Failed',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientOnline',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Online',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientRequestedWithdrawal',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Requested Withdrawal',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_ClientWithdrawalApproved',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Client Withdrawal Approved',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SubordinateClientAssigned',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Subordinate Client Assigned',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SubordinateClientDeposited',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Subordinate Client Deposited',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SubordinateClientDepositFailed',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Subordinate Client Deposit Failed',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SubordinateClientOnline',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Subordinate Client Online',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SubordinateClientRequestedWithdrawal',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Subordinate Client Requested Withdrawal',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_SubordinateClientWithdrawalApproved',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'Subordinate Client Withdrawal Approved',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'RECEIVE_UserMarkedAsBonusAbuser',

          category: 'Notifications',
          subCategory: 'Notifications',
          name: 'User Marked As Bonus Abuser',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_ACCESS_CRM',

          category: 'General',
          subCategory: 'Authentication',
          name: 'Can Access Crm',
          description:
            'Roles with this permission can access to CRM (Roles without this permission will not be able to login)',
          readOnly: false,
        },
        {
          key: 'CAN_ACCESS_LEADERBOARD',

          category: 'General',
          subCategory: 'Authentication',
          name: 'Can Access Leaderboard',
          description: 'Roles with this permission can access the leaderboard',
          readOnly: false,
        },
        {
          key: 'UPDATE_SYSTEM_COUNTRIES',

          category: 'System',
          subCategory: 'Miscellaneous',
          name: 'Update System Countries',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_COUNTRY_TIERS',

          category: 'System',
          subCategory: 'Miscellaneous',
          name: 'See Country Tiers',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CAN_MANAGE_CACHES',

          category: 'System',
          subCategory: 'Miscellaneous',
          name: 'Can Manage Caches',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_GENERAL_INFO_DROPDOWN',

          category: 'General',
          subCategory: 'Miscellaneous',
          name: 'See General Info Dropdown',
          description:
            'Roles with this permission can see the top-right General Information dropdown',
          readOnly: false,
        },
        {
          key: 'SEE_ONLINE_USERS_DROPDOWN',

          category: 'System',
          subCategory: 'Miscellaneous',
          name: 'See Online Users Dropdown',
          description:
            'Roles with this permission can see the top-right Online Users dropdown',
          readOnly: false,
        },
        {
          key: 'CAN_EXPORT_GRIDS',

          category: 'General',
          subCategory: 'Grids',
          name: 'Can Export Grids',
          description:
            'Roles with this permission can export any grid they have permission to view',
          readOnly: false,
        },
        {
          key: 'CAN_EXPORT_USERS_TO_EXCEL',

          category: 'General',
          subCategory: 'Grids',
          name: 'Can Export Users To Excel',
          description:
            'Roles with this permission can export the Clients grid to Excel',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_CLICKS',

          category: 'Dashboards',
          subCategory: 'Affiliates',
          name: 'Show Affiliate Clicks',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_TRADING_ACCOUNTS',

          category: 'Dashboards',
          subCategory: 'Affiliates',
          name: 'Show Affiliate Trading Accounts',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_FTDS',

          category: 'Dashboards',
          subCategory: 'Affiliates',
          name: 'Show Affiliate Ftds',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_PAYOUTS',

          category: 'Dashboards',
          subCategory: 'Affiliates',
          name: 'Show Affiliate Payouts',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_KPIS',

          category: 'Dashboards',
          subCategory: 'Affiliates',
          name: 'Show Affiliate Kpis',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_LINK_STATISTICS',

          category: 'Dashboards',
          subCategory: 'Affiliates',
          name: 'Show Affiliate Link Statistics',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_API_KEY',

          category: 'Dashboards',
          subCategory: 'Affiliates',
          name: 'Show Affiliate Api Key',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_PIXELS',

          category: 'Dashboards',
          subCategory: 'Affiliates',
          name: 'Show Affiliate Pixels',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_PAYOUTS_SUMMARY',

          category: 'Dashboards',
          subCategory: 'Affiliates',
          name: 'Show Affiliate Payouts Summary',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_NET_DEPOSIT_AMOUNT',

          category: 'Dashboards',
          subCategory: 'Affiliates IB',
          name: 'Show Affiliate Net Deposit Amount',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_REDEPOSITS',

          category: 'Dashboards',
          subCategory: 'Affiliates IB',
          name: 'Show Affiliate Redeposits',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_WITHDRAWAL_AMOUNT',

          category: 'Dashboards',
          subCategory: 'Affiliates IB',
          name: 'Show Affiliate Withdrawal Amount',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_FTD_AMOUNT',

          category: 'Dashboards',
          subCategory: 'Affiliates IB',
          name: 'Show Affiliate Ftd Amount',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_DEPOSIT_AMOUNT',

          category: 'Dashboards',
          subCategory: 'Affiliates IB',
          name: 'Show Affiliate Deposit Amount',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_REDEPOSIT_AMOUNT',

          category: 'Dashboards',
          subCategory: 'Affiliates IB',
          name: 'Show Affiliate Redeposit Amount',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_FULL_USERS',

          category: 'Dashboards',
          subCategory: 'Affiliates IB',
          name: 'Show Affiliate Full Users',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_CLOSE_PNL',

          category: 'Dashboards',
          subCategory: 'Affiliates IB',
          name: 'Show Affiliate Close Pnl',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_OPEN_PNL',

          category: 'Dashboards',
          subCategory: 'Affiliates IB',
          name: 'Show Affiliate Open Pnl',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_COMMISSION',

          category: 'Dashboards',
          subCategory: 'Affiliates IB',
          name: 'Show Affiliate Commission',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_VOLUME',

          category: 'Dashboards',
          subCategory: 'Affiliates IB',
          name: 'Show Affiliate Volume',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_EQUITY',

          category: 'Dashboards',
          subCategory: 'Affiliates IB',
          name: 'Show Affiliate Equity',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_TRADES_NUMBER',

          category: 'Dashboards',
          subCategory: 'Affiliates IB',
          name: 'Show Affiliate Trades Number',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'DASHBOARD_AFFILIATE_EARNINGS',

          category: 'Dashboards',
          subCategory: 'Affiliates IB',
          name: 'Show Affiliate Earnings',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_REBATES_TRADES_DASHBOARD_DATA',

          category: 'Dashboards',
          subCategory: 'Affiliates IB',
          name: 'Read Rebates Trades Dashboard Data',
          description:
            "Caution: Causes error if 'Rebates Trades' table is not in use",
          readOnly: false,
        },
        {
          key: 'SEE_CUSTOM_DEPARTMENT_RETENTION_DASHBOARD',

          category: 'General',
          subCategory: 'Miscellaneous',
          name: 'See Custom Department Retention Dashboard',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_OFFICE_MANAGER_DASHBOARD',

          category: 'General',
          subCategory: 'Miscellaneous',
          name: 'See Office Manager Dashboard',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_ANALYST_ASSIGNED_TO_ME',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Analyst Assigned To Me',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_ANALYST_NO_REDEPOSITS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Analyst No Redeposits',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_ANALYST_PENDING_WITHDRAWALS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Analyst Pending Withdrawals',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_ANALYST_ONLINE_CLIENTS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Analyst Online Clients',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_MARGIN_CALL',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Margin Call',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_WINNERS_OPEN_PNL',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Winners Open Pnl',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_WINNERS_CLOSE_PNL',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Winners Close Pnl',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_LOSERS_OPEN_PNL',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Losers Open Pnl',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_LOSERS_CLOSE_PNL',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Losers Close Pnl',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_STOPPED_OUT_CLIENTS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Stopped Out Clients',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_NON_ACTIVE_CLIENTS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Non Active Clients',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_COMPLIANCE_ALL_TIME_NOKYC_DEPOSITORS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Compliance All Time Nokyc Depositors',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_COMPLIANCE_NOKYC_DEPOSITORS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Compliance Nokyc Depositors',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_COMPLIANCE_AWAITING_REVIEW',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Compliance Awaiting Review',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_COMPLIANCE_NA_DEPOSITORS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Compliance Na Depositors',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_COMPLIANCE_PARTIAL_KYC_TRADERS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Compliance Partial Kyc Traders',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_COMPLIANCE_PROBLEMTIC_CLIENTS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Compliance Problemtic Clients',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_COMPLIANCE_UNEXPLAINED_WITHDRAWALS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Compliance Unexplained Withdrawals',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_COMPLIANCE_WITHDRAWALS_RESCUE',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Compliance Withdrawals Rescue',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_COMPLIANCE_WAITING_REFUND',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Compliance Waiting Refund',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_ASSIGNED_TO_ME',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Assigned To Me',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_ONLINE_CLIENTS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Online Clients',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_WITHDRAWALS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Withdrawals',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_MY_DEPOSITS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention My Deposits',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_NO_REDEPOSITS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention No Redeposits',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_PENDING_TASKS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Pending Tasks',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_PENDING_CALLBACKS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Pending Callbacks',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_LOSING_BROKER_USERS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Losing Broker Users',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_FORGOTTEN_CLIENTS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Forgotten Clients',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_WINNING_BROKER_USERS',

          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Winning Broker Users',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_FTD_WITH_LESS_THAN_X_CALLS',
          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Ftd With Less Than X Calls',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'READ_WIDGET_RETENTION_EFFECTIVE_CALLS',
          category: 'Widget',
          subCategory: 'General',
          name: 'Read Widget Retention Effective Calls',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_CLIENT_API_DOCUMENTATION',
          category: 'System',
          subCategory: 'Miscellaneous',
          name: 'See Client Api Documentation',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_CRM_API_DOCUMENTATION',
          category: 'System',
          subCategory: 'Miscellaneous',
          name: 'See Crm Api Documentation',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_EMAIL_GENERATOR',
          category: 'Communication',
          subCategory: 'General',
          name: 'See Email Generator',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'SEE_RETENTION_DASHBOARD_AS_SALES',
          category: 'General',
          subCategory: 'Dashboards',
          name: 'See Retention Dashboard As Sales',
          description: 'No description',
          readOnly: false,
        },
        {
          key: 'CREATE_TRANSACTION',
          category: 'User',
          subCategory: 'Transactions',
          name: 'Create User Transcation',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'READ_OPERATOR_TASKS',
          category: 'General',
          subCategory: 'Tasks',
          name: 'See Operators Task Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_USER_TRADING_GENERAL_TAB',
          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'See User Trading General Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_USER_TRADING_DEAL_TAB',
          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'See User Trading Deal Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_USER_TRADING_POSITIONS_TAB',
          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'See User Trading Positions Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_USER_TRADING_CHANGE_PASSWORD_TAB',
          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'See User Trading Change Password Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_USER_TRADING_ACTIVITYLOG_TAB',
          category: 'User',
          subCategory: 'Trading Accounts',
          name: 'See User Trading Activity Log Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_USER_TRANSACTION_ACTIVITYLOG_TAB',
          category: 'User',
          subCategory: 'Transactions',
          name: 'See User Transaction Activity Log Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_USER_TRANSACTION_GENERAL_TAB',
          category: 'User',
          subCategory: 'Transactions',
          name: 'See User Transaction General Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_USER_TRANSACTION_COMPLIANCE_TAB',
          category: 'User',
          subCategory: 'Transactions',
          name: 'See User Transaction Compliance Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_USER_TRANSACTION_BONUS_TAB',
          category: 'User',
          subCategory: 'Transactions',
          name: 'See User Transaction Bonus Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'READ_TRANSACTION_TASKS',
          category: 'User',
          subCategory: 'Transactions',
          name: 'See User Transaction Task Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_OPERATOR_SECURITY_TAB',
          category: 'System',
          subCategory: 'Operators',
          name: 'See Operator Security Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_OPERATOR_GENERAL_TAB',
          category: 'System',
          subCategory: 'Operators',
          name: 'See Operator General Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_OPERATOR_ACTIVITY_TAB',
          category: 'System',
          subCategory: 'Operators',
          name: 'See Operator Activity Log Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_AFFILIATE_COMPLIANCE_TAB',
          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'See Affiliate Compliance Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'CAN_CREATE_USER_CALLLOGS',
          category: 'User',
          subCategory: 'Users',
          name: 'Create User Calllogs',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'CAN_CREATE_USER_DEMO_ACCOUNTS',
          category: 'User',
          subCategory: 'Users',
          name: 'Create User Demo Accounts',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_USER_CALLOGS_TAB',
          category: 'User',
          subCategory: 'Users',
          name: 'See User Callogs tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_USER_EMAILS_TAB',
          category: 'User',
          subCategory: 'Users',
          name: 'See User Emails tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'READ_PARTNER_TASKS',
          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Can Read Partner Task',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'CHANGE_AFFILIATE_PASSWORD',
          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Can Change Affiliate Password',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'SEE_USER_TRANSACTION_APPROVAL_TAB',
          category: 'Affiliate',
          subCategory: 'Affiliates',
          name: 'Can Change Affiliate Password',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
        {
          key: 'READ_CLIENT_TASKS',
          category: 'General',
          subCategory: 'Tasks',
          name: 'See User Tasks Tab',
          description: 'No description',
          readOnly: false,
          isActive: true,
        },
      ];

      for await (const iterator of permission) {
        // const permissionExist = await this.permissionRepository.findOneBy({
        //   key: iterator.key,
        // });
        //   if (!permissionExist) {
        this.permissionRepository.create(
          await this.permissionRepository.save(iterator),
        );
        // }
      }
    }

    const filterCount = await this.roleFilterRepository.count();
    if (!filterCount) {
      const filter = [
        { name: 'Office' },
        { name: 'Department' },
        { name: 'Sales Desk' },
        { name: 'Support Desk' },
        { name: 'Retention Desk' },
        { name: 'KYC desk' },
        { name: 'Partner' },
        { name: 'Countries' },
        { name: 'Operators' },
        { name: 'Finance desk' },
      ];

      await this.roleFilterRepository.save(filter);
    }
  }
}
