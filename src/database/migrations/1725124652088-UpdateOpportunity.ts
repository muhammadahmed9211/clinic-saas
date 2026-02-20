import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOpportunity1725124652088 implements MigrationInterface {
  name = 'UpdateOpportunity1725124652088';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "opportunity" ADD "contact" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "opportunity" DROP COLUMN "contact"`);
  }
}
