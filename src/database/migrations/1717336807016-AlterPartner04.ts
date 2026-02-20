import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPartner041717336807016 implements MigrationInterface {
  name = 'AlterPartner041717336807016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" ADD "partnerTypeId" int`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "partnerTypeId"`,
    );
  }
}
