import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCyptoHashAndEvidenceInTrancastionTable1710499501842
  implements MigrationInterface
{
  name = 'AddedCyptoHashAndEvidenceInTrancastionTable1710499501842';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "cryptoHashReference" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "evidenceId" uniqueidentifier`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_ca20db586f6ab491358cb99cac" ON "transaction" ("evidenceId") WHERE "evidenceId" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_ca20db586f6ab491358cb99cac7" FOREIGN KEY ("evidenceId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_ca20db586f6ab491358cb99cac7"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_ca20db586f6ab491358cb99cac" ON "transaction"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "evidenceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "cryptoHashReference"`,
    );
  }
}
