import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterNotesFinal1716558577372 implements MigrationInterface {
  name = 'AlterNotesFinal1716558577372';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_b86c5f2b5de1e7a3d2a428cfb55"`,
    );
    await queryRunner.query(
      `EXEC sp_rename "user_kyc_documents.approvedBy", "approvedById"`,
    );
    await queryRunner.query(`ALTER TABLE "notes" ADD "partner_id" int`);
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "notes" ADD "created_by" bigint`);
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP COLUMN "approvedById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" ADD "approvedById" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_b86c5f2b5de1e7a3d2a428cfb55" FOREIGN KEY ("created_by") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_b5ed3719ea26bed055cfd1b40cb" FOREIGN KEY ("partner_id") REFERENCES "partner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" ADD CONSTRAINT "FK_f5e1df8f8502c9716bec610ca90" FOREIGN KEY ("approvedById") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP CONSTRAINT "FK_f5e1df8f8502c9716bec610ca90"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_b5ed3719ea26bed055cfd1b40cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_b86c5f2b5de1e7a3d2a428cfb55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP COLUMN "approvedById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" ADD "approvedById" int`,
    );
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "notes" ADD "created_by" int`);
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "partner_id"`);
    await queryRunner.query(
      `EXEC sp_rename "user_kyc_documents.approvedById", "approvedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_b86c5f2b5de1e7a3d2a428cfb55" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
