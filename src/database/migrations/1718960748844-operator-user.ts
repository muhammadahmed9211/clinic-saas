import { MigrationInterface, QueryRunner } from 'typeorm';

export class OperatorUser1718960748844 implements MigrationInterface {
  name = 'OperatorUser1718960748844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_b86c5f2b5de1e7a3d2a428cfb55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP CONSTRAINT "FK_f5e1df8f8502c9716bec610ca90"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_ece81c87c4b6fd44511dfa7f996"`,
    );
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "notes" ADD "created_by" int`);
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP COLUMN "approvedById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" ADD "approvedById" int`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "operatorId"`);
    await queryRunner.query(`ALTER TABLE "file" ADD "operatorId" int`);
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_b86c5f2b5de1e7a3d2a428cfb55" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" ADD CONSTRAINT "FK_f5e1df8f8502c9716bec610ca90" FOREIGN KEY ("approvedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_ece81c87c4b6fd44511dfa7f996" FOREIGN KEY ("operatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_ece81c87c4b6fd44511dfa7f996"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP CONSTRAINT "FK_f5e1df8f8502c9716bec610ca90"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_b86c5f2b5de1e7a3d2a428cfb55"`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "operatorId"`);
    await queryRunner.query(`ALTER TABLE "file" ADD "operatorId" bigint`);
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP COLUMN "approvedById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" ADD "approvedById" bigint`,
    );
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "notes" ADD "created_by" bigint`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_ece81c87c4b6fd44511dfa7f996" FOREIGN KEY ("operatorId") REFERENCES "operator"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" ADD CONSTRAINT "FK_f5e1df8f8502c9716bec610ca90" FOREIGN KEY ("approvedById") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_b86c5f2b5de1e7a3d2a428cfb55" FOREIGN KEY ("created_by") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
