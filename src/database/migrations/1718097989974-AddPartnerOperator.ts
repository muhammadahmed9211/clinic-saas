import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPartnerOperator1718097989974 implements MigrationInterface {
  name = 'AddPartnerOperator1718097989974';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "operator" ADD "partnerId" int`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "partnerId"`);
  }
}
