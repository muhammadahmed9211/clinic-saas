import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOperatorTable1709728557878 implements MigrationInterface {
  name = 'CreateOperatorTable1709728557878';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "operator" ("id" bigint NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_3ebfcdf9be58dd8883d29ba62af" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_67b0b958b26925ceffe7c2dafb0" DEFAULT getdate(), "affiliate_id" bigint NOT NULL CONSTRAINT "DF_489ff2ab628aba76f92eb156aba" DEFAULT 0, "country_iso" varchar(255), "email" varchar(255), "full_name" varchar(255), "is_active" tinyint NOT NULL CONSTRAINT "DF_916ed2a12c81d2468b16715443a" DEFAULT 1, "is_deleted" tinyint NOT NULL CONSTRAINT "DF_f7de8e6e2d7a050a1b08fca7973" DEFAULT 0, "language_iso" varchar(255), "role" int, "password" varchar(255) NOT NULL, "registration_ip" varchar(255), "telephone" varchar(255), "lead_sender_id" bigint NOT NULL CONSTRAINT "DF_a1f5f724268c2b9dccc7fd538bc" DEFAULT 0, "broker_id" bigint NOT NULL, "last_logon_time" datetime, "voip_extension" varchar(255), "manager_operator_id" bigint NOT NULL CONSTRAINT "DF_5a9cb0533b34625640390acd0d2" DEFAULT 0, "bypass_ip_whitelist" tinyint NOT NULL CONSTRAINT "DF_e85a6a3c7d5256b8f4b1dc92ef0" DEFAULT 0, "whitelist_ips" varchar(255), "ninja_bin" bigint NOT NULL CONSTRAINT "DF_7c80a64f84c110d15ecb2fde1f1" DEFAULT 1, "ninja_status" int NOT NULL, "daily_goal" bigint NOT NULL CONSTRAINT "DF_efa5968fe2b31b3e31a0eb2ef43" DEFAULT 0, "monthly_goal" bigint NOT NULL CONSTRAINT "DF_96e01ff8cff4a3c31a0657caf2d" DEFAULT 0, "weekly_goal" bigint NOT NULL CONSTRAINT "DF_4459aac46e867e46cf068809204" DEFAULT 0, "totp_key" varchar(255), "totp_key_url" varchar(255), "is_blocked" tinyint NOT NULL CONSTRAINT "DF_734ac5bcd112abf8498b6da8208" DEFAULT 0, "block_reason" varchar(255), "block_time" datetime, "blocked_by" bigint, "daily_accepted_calls" bigint NOT NULL CONSTRAINT "DF_7557e38ba6a3514a4eb5b515ca5" DEFAULT 0, "daily_declined_calls" bigint NOT NULL CONSTRAINT "DF_26ac9ae8bf06198c011dde75b7b" DEFAULT 0, "total_accepted_calls" bigint NOT NULL CONSTRAINT "DF_fb9ad8928ab05497a481dee2bf6" DEFAULT 0, "total_declined_calls" bigint NOT NULL CONSTRAINT "DF_a4845446bcd14b0cb53bac546b6" DEFAULT 0, "show_affiliate_sensitive_info" tinyint NOT NULL CONSTRAINT "DF_fcd084a36a90b9727710e92d4c5" DEFAULT 0, "daily_goal_number" bigint NOT NULL CONSTRAINT "DF_2e3a07af9888a507773f616e5cf" DEFAULT 0, "monthly_goal_number" bigint NOT NULL CONSTRAINT "DF_e293b57b6be6c67601f4ebe8362" DEFAULT 0, "monthly_sky_goal" bigint NOT NULL CONSTRAINT "DF_78f173f360d6717d5b47df0fac7" DEFAULT 0, "monthly_sky_goal_number" bigint NOT NULL CONSTRAINT "DF_8a8fe797cc0bf0c5ca6602c0942" DEFAULT 0, "weekly_goal_number" bigint NOT NULL CONSTRAINT "DF_c20a23bcd5a47c88bfa4e241c60" DEFAULT 0, "role_id" bigint, "image_url" varchar(255), "app_id" bigint NOT NULL CONSTRAINT "DF_722f6482e3d35c1af65146d012d" DEFAULT 0, "is_test" tinyint NOT NULL CONSTRAINT "DF_4878e672e33a9fc608b96a09d85" DEFAULT 0, "time_zone" varchar(255), "password_expiry_date" datetime, "daily_volume_goal" bigint NOT NULL CONSTRAINT "DF_0c807d24a37f302c2fc8f53d54d" DEFAULT 0, "weekly_volume_goal" bigint NOT NULL CONSTRAINT "DF_ba9dbd5d59f9a96f5d2d513f4f1" DEFAULT 0, "monthly_volume_goal" bigint NOT NULL CONSTRAINT "DF_7dcadcffd6b17ed786799e4afcf" DEFAULT 0, "monthly_volume_sky_goal" bigint NOT NULL CONSTRAINT "DF_c980938beac7d43cd9a77e0f1ca" DEFAULT 0, "password_salt" varchar(255), "monthly_accepted_calls" bigint NOT NULL CONSTRAINT "DF_796f80ea6a922a8f8d2926bf252" DEFAULT 0, "monthly_declined_calls" bigint NOT NULL CONSTRAINT "DF_cd09ab7bc443e036be9197e8a78" DEFAULT 0, "daily_cancelled_calls" bigint NOT NULL CONSTRAINT "DF_79e1773151e6987dd2b4bc031d8" DEFAULT 0, "monthly_cancelled_calls" bigint NOT NULL CONSTRAINT "DF_5c889e41cc33ae7d46e032e4599" DEFAULT 0, "advertiser_id" bigint NOT NULL CONSTRAINT "DF_383dbb615f2a0078ca3b8d34965" DEFAULT 0, "affiliate_ids" varchar(511), "imap_host" varchar(128), "imap_port" varchar(128), "imap_password" varchar(128), "imap_protocol" varchar(128), "imap_ssl_enabled" tinyint, "imap_ssl_protocol" varchar(128), "imap_folders" varchar(255), "smtp_host" varchar(128), "smtp_port" varchar(128), "smtp_password" varchar(128), "smtp_protocol" varchar(128), "smtp_transport_strategy" varchar(128), CONSTRAINT "PK_8b950e1572745d9f69be7748ae8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "operator_desk_rel" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_718a7faa810da4d0af4ef69089c" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_279e38eca33b412cf5923ae2356" DEFAULT getdate(), "operator_id" bigint, "desk_id" bigint, CONSTRAINT "UQ_5eb932df63767d7ec04e22406ad" UNIQUE ("operator_id", "desk_id"), CONSTRAINT "PK_22ac2bb66b26c338bea8b206663" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_desk_rel" ADD CONSTRAINT "FK_c7aaf97e016b1dad01811558c3a" FOREIGN KEY ("operator_id") REFERENCES "operator"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_desk_rel" ADD CONSTRAINT "FK_8de33f0ce3e0acae31f39f8b350" FOREIGN KEY ("desk_id") REFERENCES "desk"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator_desk_rel" DROP CONSTRAINT "FK_8de33f0ce3e0acae31f39f8b350"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_desk_rel" DROP CONSTRAINT "FK_c7aaf97e016b1dad01811558c3a"`,
    );
    await queryRunner.query(`DROP TABLE "operator_desk_rel"`);
    await queryRunner.query(`DROP TABLE "operator"`);
  }
}
