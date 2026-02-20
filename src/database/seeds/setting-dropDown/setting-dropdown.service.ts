import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Office } from 'src/admin/custom-dropdown/custom-dropdown/entities/office.entity';
import { Desk } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk.entity';
import { DeskType } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk_type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SettingDropDownSeedService {
  constructor(
    @InjectRepository(Office)
    private OfficeRepository: Repository<Office>,
    @InjectRepository(Desk)
    private DeskRepository: Repository<Desk>,
    @InjectRepository(DeskType)
    private DeskTypeRepository: Repository<DeskType>,
  ) {}

  async run() {
    const officeCount = await this.OfficeRepository.count();
    const DeskCount = await this.DeskRepository.count();
    const DeskTypeCount = await this.DeskTypeRepository.count();

    if (DeskTypeCount === 0) {
      const DeskType = [
        {
          id: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'sales',
        },
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'retention',
        },
        {
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'ninja',
        },
        {
          id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'KYC',
        },
        {
          id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Support',
        },
        {
          id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'finance',
        },
      ];
      await this.DeskTypeRepository.save(DeskType);
    }

    if (officeCount === 0) {
      const officesData = [
        {
          id: 1,
          name: 'Example Office',
          createdAt: new Date(),
          updatedAt: new Date(),
          app_id: 1,
        },
      ];

      await this.OfficeRepository.save(officesData);
    }

    if (DeskCount === 0) {
      const DeskData = [
        {
          id: 1,
          createdAt: '2023-07-31 05:30:13',
          updatedAt: '2023-09-15 13:54:10.000000',
          name: 'Sales Desk',
          type: 0,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,

          app_id: 0,
          is_active: true,
        },
        {
          id: 2,
          createdAt: '2023-07-31 05:30:13',
          updatedAt: '2023-09-15 13:55:26.000000',
          name: 'Ninja',
          type: 2,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,

          app_id: 0,
          is_active: true,
        },
        {
          id: 3,
          createdAt: '2023-07-31 05:30:13',
          updatedAt: '2023-09-15 13:54:19.000000',
          name: 'Retention',
          type: 1,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,

          app_id: 0,
          is_active: true,
        },
        {
          id: 4,
          createdAt: '2023-08-01 05:58:01',
          updatedAt: '2023-11-13 11:52:07.000000',
          name: 'General- EN',
          type: 2,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,

          app_id: 0,
          is_active: true,
        },
        {
          id: 5,
          createdAt: '2023-08-01 05:58:11',
          updatedAt: '2023-11-13 11:51:59.000000',
          name: 'Standard- EN',
          type: 2,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,

          app_id: 0,
          is_active: true,
        },
        {
          id: 6,
          createdAt: '2023-08-01 05:58:20',
          updatedAt: '2023-11-13 11:51:49.000000',
          name: 'Premium - EN',
          type: 2,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,

          app_id: 0,
          is_active: true,
        },
        {
          id: 7,
          createdAt: '2023-09-27 14:30:42',
          updatedAt: '2024-03-16 11:41:43.739000',
          name: 'Sales - Stocksy Call Center',
          type: 0,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,

          app_id: 0,
          is_active: true,
        },
        {
          id: 8,
          createdAt: '2023-10-13 06:50:03',
          updatedAt: '2024-03-16 11:41:56.063000',
          name: 'Sales - Edge Fund Call Center',
          type: 0,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,

          app_id: 0,
          is_active: true,
        },
        {
          id: 9,
          createdAt: '2023-11-13 11:52:40',
          updatedAt: '2023-11-13 11:52:40.000000',
          name: 'Premium - AR',
          type: 2,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,
          office_id: 1,
          app_id: 0,
          is_active: true,
        },
        {
          id: 10,
          createdAt: '2023-11-13 11:53:11',
          updatedAt: '2023-11-13 11:53:11.000000',
          name: 'Standard- AR',
          type: 2,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,
          office_id: 1,
          app_id: 0,
          is_active: true,
        },
        {
          id: 11,
          createdAt: '2023-11-13 11:53:37',
          updatedAt: '2023-11-13 11:53:37.000000',
          name: 'General- AR',
          type: 2,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,

          app_id: 0,
          is_active: true,
        },
        {
          id: 12,
          createdAt: '2023-11-20 14:07:34',
          updatedAt: '2024-03-16 11:41:35.308000',
          name: 'Sales - Unix Call Center',
          type: 0,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,

          app_id: 0,
          is_active: true,
        },
        {
          id: 13,
          createdAt: '2023-12-05 11:18:42',
          updatedAt: '2023-12-05 11:18:42.000000',
          name: 'Khalil Diab Sales Desk',
          type: 0,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 50000000,
          weekly_goal: 0,
          office_id: 1,
          app_id: 0,
          is_active: true,
        },
        {
          id: 14,
          createdAt: '2024-03-16 11:20:01',
          updatedAt: '2024-03-16 12:27:43.957000',
          name: 'Retention - Unix Call Center',
          type: 1,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,

          app_id: 0,
          is_active: true,
        },
        {
          id: 15,
          createdAt: '2024-03-16 11:23:46',
          updatedAt: '2024-03-16 11:42:03.613000',
          name: 'Retention - Edge Fund Call Center',
          type: 1,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,

          app_id: 0,
          is_active: true,
        },
        {
          id: 16,
          createdAt: '2024-03-16 11:24:42',
          updatedAt: '2024-03-16 12:31:45.595000',
          name: 'Retention - Stocksy Call Center',
          type: 1,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,

          app_id: 0,
          is_active: true,
        },
        {
          id: 17,
          createdAt: '2024-03-16 12:28:44',
          updatedAt: '2024-03-16 12:30:09.007000',
          name: 'deleted 2',
          type: 0,
          is_test: false,
          daily_goal: 0,
          monthly_goal: 0,
          weekly_goal: 0,

          app_id: 0,
          is_active: false,
        },
      ];
      await this.DeskRepository.save(DeskData);
    }
  }
}
