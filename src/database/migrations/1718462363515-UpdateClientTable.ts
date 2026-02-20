import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateClientTable1718462363515 implements MigrationInterface {
  name = 'UpdateClientTable1718462363515';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "lastLoginTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "facebookUID" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "firsSalesDeskId" int`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "fullName" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "googleUID" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "hasBrokerUser" bit`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isDemo" bit NOT NULL CONSTRAINT "DF_d0735fad2983b2919fc4d2ac384" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isTradingActive" bit NOT NULL CONSTRAINT "DF_fa1364aa7cd992b3072b4dc7c1f" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "lastActionTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "originalAffiliate" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "originAlffiliateId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "orignalEmail" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "registrationIp" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "orignalSource" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "orignalTelephone" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "orginalTelephonePrefix" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "passwordExpiryDate" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "registrationAffiliateId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "telephoneConfirmationTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isTelephoneConfirmed" bit NOT NULL CONSTRAINT "DF_de7446b2749166382c4278ef512" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_de7446b2749166382c4278ef512"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isTelephoneConfirmed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "telephoneConfirmationTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "registrationAffiliateId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "passwordExpiryDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "orginalTelephonePrefix"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "orignalTelephone"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "orignalSource"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "registrationIp"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "orignalEmail"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "originAlffiliateId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "originalAffiliate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "lastActionTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_fa1364aa7cd992b3072b4dc7c1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isTradingActive"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_d0735fad2983b2919fc4d2ac384"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isDemo"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "hasBrokerUser"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "googleUID"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "fullName"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "firsSalesDeskId"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "facebookUID"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "lastLoginTime"`);
  }
}
