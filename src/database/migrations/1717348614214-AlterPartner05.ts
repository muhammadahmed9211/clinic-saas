import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPartner051717348614214 implements MigrationInterface {
  name = 'AlterPartner051717348614214';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" ADD "partnerTypeId" int`);
    await queryRunner.query(
      `ALTER TABLE "partner" ALTER COLUMN "title" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ALTER COLUMN "name" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ALTER COLUMN "contactName" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ALTER COLUMN "email" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ALTER COLUMN "password" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" ALTER COLUMN "password" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ALTER COLUMN "email" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ALTER COLUMN "contactName" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ALTER COLUMN "name" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ALTER COLUMN "title" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "partnerTypeId"`,
    );
  }
}
