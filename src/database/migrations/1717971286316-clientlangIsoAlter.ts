import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientlangIsoAlter1717971286316 implements MigrationInterface {
  name = 'ClientlangIsoAlter1717971286316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "countryIso" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "languageIso" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "languageIso"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "countryIso"`);
  }
}
