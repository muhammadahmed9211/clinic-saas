import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { OperatorDeskRel } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator-desk.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OperatorSeedService {
  constructor(
    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OperatorDeskRel)
    private readonly OperatorDeskRelRepository: Repository<OperatorDeskRel>,
  ) {}

  async run() {
    const operatorCount = await this.operatorRepository.count();
    const operatorExist = await this.operatorRepository.findOne({
      where: { email: 'admin@example.com' },
    });
    const operatorDeskRelExist = await this.OperatorDeskRelRepository.count();

    const operatorData = [
      {
        id: 1,
        createdAt: '2023-07-31 05:30:13',
        updatedAt: '2024-06-23 07:23:18.199238',
        affiliate_id: 0,
        country_iso: 'XX',
        email: 'admin@antelopesystem.com',
        full_name: 'Admin',
        is_active: true,
        is_deleted: false,
        language_iso: 'EN',
        role: { id: 1 },
        password: 'Operator@123',
        registration_ip: '0:0:0:0:0:0:0:1',

        lead_sender_id: 0,
        broker_id: 0,
        last_logon_time: '2024-06-23 07:23:18',
        manager_operator: 0,
        bypass_ip_whitelist: true,

        ninja_bin: 1,
        ninja_status: 0,
        daily_goal: 0,
        monthly_goal: 0,
        weekly_goal: 0,
        totp_key: 'W6OTFW3MRNWTOPKN',
        totp_key_url: 'otpauth://totp/SiliconfortCRMProd?secret=W6OTFW3MRNWTOPKN',
        is_blocked: false,

        daily_accepted_calls: 0,
        daily_declined_calls: 0,
        total_accepted_calls: 0,
        total_declined_calls: 0,
        show_affiliate_sensitive_info: false,
        daily_goal_number: 0,
        monthly_goal_number: 0,
        monthly_sky_goal: 0,
        monthly_sky_goal_number: 0,
        weekly_goal_number: 0,

        app_id: 0,
        is_test: true,
        time_zone: 'Asia/Riyadh',

        daily_volume_goal: 0,
        weekly_volume_goal: 0,
        monthly_volume_goal: 0,
        monthly_volume_sky_goal: 0,

        monthly_accepted_calls: 0,
        monthly_declined_calls: 0,
        daily_cancelled_calls: 0,
        monthly_cancelled_calls: 0,
        advertiser_id: 0,
      },
    ];

    if (operatorCount === 0) {
      for (const iterator of operatorData) {
        await this.operatorRepository.save(
          this.operatorRepository.create(iterator),
        );

        await this.userRepository.save(
          this.userRepository.create({
            email: iterator.email,
            firstName: iterator.full_name,
            password: iterator.password,
            role: iterator.role,
            isOperator: true,
            operator: { id: iterator.id },
          }),
        );
      }
    }

    const operatorDeskRelData = [
      {
        operator: { id: 1016 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1021 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1028 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1029 },
        desk: { id: 8 },
      },
      {
        operator: { id: 1024 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1026 },
        desk: { id: 12 },
      },
      {
        operator: { id: 1055 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1023 },
        desk: { id: 7 },
      },
      {
        operator: { id: 1060 },
        desk: { id: 13 },
      },
      {
        operator: { id: 1062 },
        desk: { id: 13 },
      },
      {
        operator: { id: 1065 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1054 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1076 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1025 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1050 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1081 },
        desk: { id: 13 },
      },
      {
        operator: { id: 1096 },
        desk: { id: 13 },
      },
      {
        operator: { id: 1048 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1095 },
        desk: { id: 13 },
      },
      {
        operator: { id: 1086 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1138 },
        desk: { id: 12 },
      },
      {
        operator: { id: 1061 },
        desk: { id: 13 },
      },
      {
        operator: { id: 1121 },
        desk: { id: 13 },
      },
      {
        operator: { id: 1136 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1143 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1144 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1137 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1150 },
        desk: { id: 15 },
      },
      {
        operator: { id: 1151 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1154 },
        desk: { id: 15 },
      },
      {
        operator: { id: 1154 },
        desk: { id: 16 },
      },
      {
        operator: { id: 1154 },
        desk: { id: 14 },
      },
      {
        operator: { id: 1044 },
        desk: { id: 17 },
      },
      {
        operator: { id: 1044 },
        desk: { id: 13 },
      },
      {
        operator: { id: 1044 },
        desk: { id: 3 },
      },
      {
        operator: { id: 1044 },
        desk: { id: 15 },
      },
      {
        operator: { id: 1044 },
        desk: { id: 16 },
      },
      {
        operator: { id: 1044 },
        desk: { id: 14 },
      },
      {
        operator: { id: 1044 },
        desk: { id: 8 },
      },
      {
        operator: { id: 1044 },
        desk: { id: 7 },
      },
      {
        operator: { id: 1044 },
        desk: { id: 12 },
      },
      {
        operator: { id: 1044 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1163 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1164 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1059 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1167 },
        desk: { id: 3 },
      },
      {
        operator: { id: 1167 },
        desk: { id: 15 },
      },
      {
        operator: { id: 1167 },
        desk: { id: 16 },
      },
      {
        operator: { id: 1167 },
        desk: { id: 14 },
      },
      {
        operator: { id: 1156 },
        desk: { id: 3 },
      },
      {
        operator: { id: 1156 },
        desk: { id: 16 },
      },
      {
        operator: { id: 1156 },
        desk: { id: 15 },
      },
      {
        operator: { id: 1156 },
        desk: { id: 14 },
      },
      {
        operator: { id: 1155 },
        desk: { id: 3 },
      },
      {
        operator: { id: 1155 },
        desk: { id: 15 },
      },
      {
        operator: { id: 1155 },
        desk: { id: 16 },
      },
      {
        operator: { id: 1155 },
        desk: { id: 14 },
      },
      {
        operator: { id: 1153 },
        desk: { id: 3 },
      },
      {
        operator: { id: 1153 },
        desk: { id: 15 },
      },
      {
        operator: { id: 1153 },
        desk: { id: 16 },
      },
      {
        operator: { id: 1153 },
        desk: { id: 14 },
      },
      {
        operator: { id: 1152 },
        desk: { id: 3 },
      },
      {
        operator: { id: 1152 },
        desk: { id: 15 },
      },
      {
        operator: { id: 1152 },
        desk: { id: 16 },
      },
      {
        operator: { id: 1152 },
        desk: { id: 14 },
      },
      {
        operator: { id: 1149 },
        desk: { id: 3 },
      },
      {
        operator: { id: 1149 },
        desk: { id: 15 },
      },
      {
        operator: { id: 1149 },
        desk: { id: 16 },
      },
      {
        operator: { id: 1149 },
        desk: { id: 14 },
      },
      {
        operator: { id: 1141 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1049 },
        desk: { id: 15 },
      },
      {
        operator: { id: 1049 },
        desk: { id: 16 },
      },
      {
        operator: { id: 1049 },
        desk: { id: 14 },
      },
      {
        operator: { id: 1049 },
        desk: { id: 8 },
      },
      {
        operator: { id: 1049 },
        desk: { id: 7 },
      },
      {
        operator: { id: 1049 },
        desk: { id: 12 },
      },
      {
        operator: { id: 1049 },
        desk: { id: 3 },
      },
      {
        operator: { id: 1174 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1173 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1162 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1161 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1177 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1178 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1004 },
        desk: { id: 15 },
      },
      {
        operator: { id: 1004 },
        desk: { id: 16 },
      },
      {
        operator: { id: 1168 },
        desk: { id: 3 },
      },
      {
        operator: { id: 1168 },
        desk: { id: 15 },
      },
      {
        operator: { id: 1168 },
        desk: { id: 16 },
      },
      {
        operator: { id: 1168 },
        desk: { id: 14 },
      },
      {
        operator: { id: 1183 },
        desk: { id: 3 },
      },
      {
        operator: { id: 1183 },
        desk: { id: 15 },
      },
      {
        operator: { id: 1183 },
        desk: { id: 16 },
      },
      {
        operator: { id: 1183 },
        desk: { id: 14 },
      },
      {
        operator: { id: 1185 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1022 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1188 },
        desk: { id: 1 },
      },
      {
        operator: { id: 1008 },
        desk: { id: 3 },
      },
      {
        operator: { id: 1008 },
        desk: { id: 15 },
      },
      {
        operator: { id: 1008 },
        desk: { id: 16 },
      },
      {
        operator: { id: 1008 },
        desk: { id: 14 },
      },
      {
        operator: { id: 1195 },
        desk: { id: 3 },
      },
      {
        operator: { id: 1195 },
        desk: { id: 15 },
      },
      {
        operator: { id: 1195 },
        desk: { id: 16 },
      },
      {
        operator: { id: 1195 },
        desk: { id: 14 },
      },
    ];

    if (operatorDeskRelExist === 0) {
      for (const iterator of operatorDeskRelData) {
        await this.OperatorDeskRelRepository.save(iterator);
      }
    }

    const adminOperator = {
      id: 1196,
      createdAt: new Date('2024-02-20 13:53:56'),
      updatedAt: new Date('2024-02-20 13:53:55.901000'),
      country_iso: 'AE',
      email: 'admin@example.com',
      full_name: 'Super Admin',
      is_active: true,
      is_deleted: false,
      password: 'Test@123',
      registration_ip: '94.204.100.200',
      telephone: '',
      lead_sender_id: 0,
      broker_id: 0,
      manager_operator: 0,
      bypass_ip_whitelist: true,
      role: { id: 1 },
      ninja_bin: 1,
      ninja_status: 0,
      daily_goal: 0,
      monthly_goal: 0,
      weekly_goal: 0,
      is_blocked: false,
      daily_accepted_calls: 0,
      daily_declined_calls: 0,
      total_accepted_calls: 0,
      total_declined_calls: 0,
      show_affiliate_sensitive_info: false,
      daily_goal_number: 0,
      monthly_goal_number: 0,
      monthly_sky_goal: 0,
      monthly_sky_goal_number: 0,
      weekly_goal_number: 0,
      app_id: 0,
      is_test: false,
      daily_volume_goal: 0,
      weekly_volume_goal: 0,
      monthly_volume_goal: 0,
      monthly_volume_sky_goal: 0,
      monthly_accepted_calls: 0,
      monthly_declined_calls: 0,
      daily_cancelled_calls: 0,
      monthly_cancelled_calls: 0,
      advertiser_id: 0,
    };

    if (!operatorExist) {
      await this.operatorRepository.save(
        this.operatorRepository.create(adminOperator),
      );

      await this.userRepository.update(
        { email: adminOperator.email },
        {
          operator: { id: adminOperator.id },
          isOperator: true,
        },
      );
    }
  }
}
