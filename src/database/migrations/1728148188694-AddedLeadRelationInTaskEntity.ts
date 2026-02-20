import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedLeadRelationInTaskEntity1728148188694
  implements MigrationInterface
{
  name = 'AddedLeadRelationInTaskEntity1728148188694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "leadId" int`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "leadId"`);
  }
}
