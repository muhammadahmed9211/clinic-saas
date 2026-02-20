import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateClientTable1726303340215 implements MigrationInterface {
  name = 'UpdateClientTable1726303340215';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" ADD "salesManagerId" int`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "salesManager" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "salesManager"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "salesManagerId"`,
    );
  }
}
