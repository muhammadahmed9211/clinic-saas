import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedPspRegulationsTable1729170145912
  implements MigrationInterface
{
  name = 'AddedPspRegulationsTable1729170145912';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "psp_regulations" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime NOT NULL CONSTRAINT "DF_00ed8189cb6c319efc47de60bde" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_b773cb8fa82bfdbc429e098aa55" DEFAULT getdate(), "deletedAt" datetime2, "pspId" int NOT NULL, "regulationId" int NOT NULL, CONSTRAINT "PK_480e597c4cb89934d35b6a3e74f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp_regulations" ADD CONSTRAINT "FK_91420b1967d3749908c13a88fac" FOREIGN KEY ("pspId") REFERENCES "psp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp_regulations" ADD CONSTRAINT "FK_83e79c5036c79479c23c8db3058" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "psp_regulations" DROP CONSTRAINT "FK_83e79c5036c79479c23c8db3058"`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp_regulations" DROP CONSTRAINT "FK_91420b1967d3749908c13a88fac"`,
    );
    await queryRunner.query(`DROP TABLE "psp_regulations"`);
  }
}
