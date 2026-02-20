import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedKeyInLeadQuestionTable1722945409479
  implements MigrationInterface
{
  name = 'AddedKeyInLeadQuestionTable1722945409479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead_question" ADD "key" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_question" ADD CONSTRAINT "UQ_3c2299c9c4ef9eab8bd359f2c2c" UNIQUE ("key")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3c2299c9c4ef9eab8bd359f2c2" ON "lead_question" ("key") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_3c2299c9c4ef9eab8bd359f2c2" ON "lead_question"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_question" DROP CONSTRAINT "UQ_3c2299c9c4ef9eab8bd359f2c2c"`,
    );
    await queryRunner.query(`ALTER TABLE "lead_question" DROP COLUMN "key"`);
  }
}
