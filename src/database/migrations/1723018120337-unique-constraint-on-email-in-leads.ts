import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueConstraintOnEmailInLeads1723018120337
  implements MigrationInterface
{
  name = 'UniqueConstraintOnEmailInLeads1723018120337';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "UQ_82927bc307d97fe09c616cd3f58" UNIQUE ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "UQ_82927bc307d97fe09c616cd3f58"`,
    );
  }
}
