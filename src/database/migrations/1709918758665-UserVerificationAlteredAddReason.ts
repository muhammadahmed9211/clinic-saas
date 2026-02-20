import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserVerificationAlteredAddReason1709918758665
  implements MigrationInterface
{
  name = 'UserVerificationAlteredAddReason1709918758665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_verification" ADD "reason" nvarchar(255) CONSTRAINT CHK_ee3ef4e1ebb18c927d452eb462_ENUM CHECK(reason IN ('refresh','reset_password','verify_email','verify_mobile','verify_transaction')) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_verification" DROP COLUMN "reason"`,
    );
  }
}
