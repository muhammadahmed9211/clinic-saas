import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedAffIdInLeadTable1722954468302 implements MigrationInterface {
  name = 'AddedAffIdInLeadTable1722954468302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" ADD "leadId" int`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "pu" bit`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "affId" uniqueidentifier`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "affId"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "pu"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "leadId"`);
  }
}
