import { MigrationInterface, QueryRunner } from 'typeorm';

export class OperatorTableUpdate1715347969665 implements MigrationInterface {
  name = 'OperatorTableUpdate1715347969665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "operator" ADD "system" int`);
    await queryRunner.query(`ALTER TABLE "operator" ADD "desk_id" int`);
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "affiliate_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "email" varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "full_name" varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "is_active" tinyint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "is_deleted" tinyint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "password" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "lead_sender_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "manager_operator_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "bypass_ip_whitelist" tinyint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "ninja_bin" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP COLUMN "ninja_status"`,
    );
    await queryRunner.query(`ALTER TABLE "operator" ADD "ninja_status" int`);
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "daily_goal" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_goal" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "weekly_goal" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "is_blocked" tinyint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "daily_accepted_calls" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "daily_declined_calls" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "total_accepted_calls" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "total_declined_calls" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "show_affiliate_sensitive_info" tinyint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "daily_goal_number" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_goal_number" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_sky_goal" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_sky_goal_number" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "weekly_goal_number" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "app_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "is_test" tinyint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "daily_volume_goal" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "weekly_volume_goal" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_volume_goal" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_volume_sky_goal" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_accepted_calls" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_declined_calls" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "daily_cancelled_calls" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_cancelled_calls" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "advertiser_id" bigint`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "advertiser_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_cancelled_calls" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "daily_cancelled_calls" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_declined_calls" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_accepted_calls" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_volume_sky_goal" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_volume_goal" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "weekly_volume_goal" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "daily_volume_goal" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "is_test" tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "app_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "weekly_goal_number" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_sky_goal_number" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_sky_goal" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_goal_number" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "daily_goal_number" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "show_affiliate_sensitive_info" tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "total_declined_calls" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "total_accepted_calls" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "daily_declined_calls" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "daily_accepted_calls" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "is_blocked" tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "weekly_goal" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "monthly_goal" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "daily_goal" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP COLUMN "ninja_status"`,
    );
    await queryRunner.query(`ALTER TABLE "operator" ADD "ninja_status" bigint`);
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "ninja_bin" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "bypass_ip_whitelist" tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "manager_operator_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "lead_sender_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "password" varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "is_deleted" tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "is_active" tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "full_name" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "email" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "affiliate_id" bigint NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "desk_id"`);
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "system"`);
  }
}
