import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOpportunity1722509522199 implements MigrationInterface {
  name = 'UpdateOpportunity1722509522199';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "opportunity" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "opportunity" DROP COLUMN "amount"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "opportunity" ADD "amount" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" ADD "type" nvarchar(255) NOT NULL`,
    );
  }
}
