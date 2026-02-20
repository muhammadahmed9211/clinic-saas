import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserDocuments1708337230233 implements MigrationInterface {
  name = 'UserDocuments1708337230233';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" ADD "side" varchar(10) CONSTRAINT CHK_2eed7a05a74fd523719b5931cb_ENUM CHECK(side IN ('front','back'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_35472b1fe48b6330cd34970956" ON "wallet" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_35472b1fe48b6330cd34970956" ON "wallet"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP COLUMN "side"`,
    );
  }
}
