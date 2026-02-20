import { MigrationInterface, QueryRunner } from 'typeorm';

export class SameTableRelationForTranscation1717774616825
  implements MigrationInterface
{
  name = 'SameTableRelationForTranscation1717774616825';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "relatedTransactionId" uniqueidentifier`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_698033f6f5784451d4c06d40a68" FOREIGN KEY ("relatedTransactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_698033f6f5784451d4c06d40a68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "relatedTransactionId"`,
    );
  }
}
