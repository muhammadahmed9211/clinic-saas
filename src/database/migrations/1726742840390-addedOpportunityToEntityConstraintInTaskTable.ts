import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedOpportunityToEntityConstraintInTaskTable1726742840390
  implements MigrationInterface
{
  name = 'AddedOpportunityToEntityConstraintInTaskTable1726742840390';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "CHK_800518338998c2d06437eb0131" CHECK ("entity" IN ('general','client','operator','partner', 'transaction', 'lead', 'opportunity'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "CHK_800518338998c2d06437eb0131"`,
    );
  }
}
