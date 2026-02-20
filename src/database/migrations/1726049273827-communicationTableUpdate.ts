import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommunicationTableUpdate1726049273827
  implements MigrationInterface
{
  name = 'CommunicationTableUpdate1726049273827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "communication" ADD "deletedAt" datetime2`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication" ADD CONSTRAINT "FK_045a80cba824af9448fe63c41ce" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "communication" DROP CONSTRAINT "FK_045a80cba824af9448fe63c41ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication" DROP COLUMN "deletedAt"`,
    );
  }
}
