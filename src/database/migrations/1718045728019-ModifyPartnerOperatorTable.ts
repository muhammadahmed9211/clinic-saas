import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyPartnerOperatorTable1718045728019
  implements MigrationInterface
{
  name = 'ModifyPartnerOperatorTable1718045728019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" ADD "operatorId" int`);
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "isPartner" bit NOT NULL CONSTRAINT "DF_d5af5fb932418449883b10f278b" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "DF_d5af5fb932418449883b10f278b"`,
    );
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "isPartner"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "operatorId"`);
  }
}
