import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedLeadQuestionAndAnswerTable1722243888300
  implements MigrationInterface
{
  name = 'AddedLeadQuestionAndAnswerTable1722243888300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lead_answer" ("id" int NOT NULL IDENTITY(1,1), "value" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_cfd7320d55602f865639290bee9" DEFAULT getdate(), "deletedAt" datetime2, "updatedAt" datetime NOT NULL CONSTRAINT "DF_775d640cb2e262d7ad008248b3e" DEFAULT getdate(), "questionId" int, CONSTRAINT "PK_04a7addf8479acb5028583ad132" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lead_question" ("id" int NOT NULL IDENTITY(1,1), "label" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "dataType" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_ca20ac50d865c814c1bb1e242f5" DEFAULT getdate(), "deletedAt" datetime2, "updatedAt" datetime NOT NULL CONSTRAINT "DF_3d061c53d8c467975ef4d2effa3" DEFAULT getdate(), "createdById" int, CONSTRAINT "PK_bac88aa70d95ecb7ddc378f2c1e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_answer" ADD CONSTRAINT "FK_cbf01e78daf012e35386670c25e" FOREIGN KEY ("questionId") REFERENCES "lead_question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_question" ADD CONSTRAINT "FK_68482d42b9d8864dc95ec8dc0fa" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead_question" DROP CONSTRAINT "FK_68482d42b9d8864dc95ec8dc0fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_answer" DROP CONSTRAINT "FK_cbf01e78daf012e35386670c25e"`,
    );
    await queryRunner.query(`DROP TABLE "lead_question"`);
    await queryRunner.query(`DROP TABLE "lead_answer"`);
  }
}
