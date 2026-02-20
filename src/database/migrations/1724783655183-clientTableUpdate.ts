import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientTableUpdate1724783655183 implements MigrationInterface {
  name = 'ClientTableUpdate1724783655183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "localTime" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "preferredTime" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "totalDeposits" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "createdBy" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "modifiedBy" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "skypeID" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "leadTitle" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "leadTitle"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "skypeID"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "modifiedBy"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "createdBy"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "totalDeposits"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "preferredTime"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "localTime"`);
  }
}
