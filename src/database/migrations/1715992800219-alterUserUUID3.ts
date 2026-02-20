import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUserUUID31715992800219 implements MigrationInterface {
  name = 'AlterUserUUID31715992800219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "uuid" uniqueidentifier NOT NULL CONSTRAINT "DF_a95e949168be7b7ece1a2382fed" DEFAULT NEWID()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_a95e949168be7b7ece1a2382fed"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "uuid"`);
  }
}
