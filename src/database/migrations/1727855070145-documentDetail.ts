import { MigrationInterface, QueryRunner } from 'typeorm';

export class DocumentDetail1727855070145 implements MigrationInterface {
  name = 'DocumentDetail1727855070145';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ADD "rejectedReasonOther" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" DROP COLUMN "rejectedReasonOther"`,
    );
  }
}
