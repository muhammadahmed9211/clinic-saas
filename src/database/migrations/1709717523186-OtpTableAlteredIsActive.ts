import { MigrationInterface, QueryRunner } from 'typeorm';

export class OtpTableAlteredIsActive1709717523186
  implements MigrationInterface
{
  name = 'OtpTableAlteredIsActive1709717523186';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "otp" ADD "isActive" bit NOT NULL CONSTRAINT "DF_505dd34f8e916790bf00962c36b" DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "otp" DROP CONSTRAINT "DF_505dd34f8e916790bf00962c36b"`,
    );
    await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "isActive"`);
  }
}
