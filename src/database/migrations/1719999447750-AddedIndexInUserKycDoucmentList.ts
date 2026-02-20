import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedIndexInUserKycDoucmentList1719999447750
  implements MigrationInterface
{
  name = 'AddedIndexInUserKycDoucmentList1719999447750';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_0162eda41660358a4a5641efdd" ON "user_kyc_documents" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9fdcda83a3f82a30f38d7db31a" ON "user_kyc_documents" ("documentId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_72d484cdf856cf5617706f212a" ON "user_kyc_documents" ("fileId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ae09c60808b9aedba6682bb1b7" ON "user_kyc_documents" ("field_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b9e8d27d5eeaa6a7c0013d2604" ON "user_kyc_documents" ("kycStatus") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f5e1df8f8502c9716bec610ca9" ON "user_kyc_documents" ("approvedById") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_f5e1df8f8502c9716bec610ca9" ON "user_kyc_documents"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_b9e8d27d5eeaa6a7c0013d2604" ON "user_kyc_documents"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_ae09c60808b9aedba6682bb1b7" ON "user_kyc_documents"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_72d484cdf856cf5617706f212a" ON "user_kyc_documents"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_9fdcda83a3f82a30f38d7db31a" ON "user_kyc_documents"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_0162eda41660358a4a5641efdd" ON "user_kyc_documents"`,
    );
  }
}
