import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterClientEdit1716894179660 implements MigrationInterface {
  name = 'AlterClientEdit1716894179660';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" ADD "campaignId" text`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "thirdPrefix" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "thirdTelephone" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "topTradingProducts" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "registrationDevice" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "lastTradeTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "clientGrading" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "regulations" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "regulations"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "clientGrading"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "lastTradeTime"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "registrationDevice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "topTradingProducts"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "thirdTelephone"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "thirdPrefix"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "campaignId"`);
  }
}
