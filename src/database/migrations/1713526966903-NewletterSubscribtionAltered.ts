import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1713526966903 implements MigrationInterface {
  name = 'Test1713526966903';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "newsletter_subscriptions" DROP COLUMN "meta_data"`,
    );

    await queryRunner.query(
      `ALTER TABLE "newsletter_subscriptions" ADD "isVerified" bit NOT NULL CONSTRAINT "DF_7c9573043bdbb957d2ebcd439e2" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "newsletter_subscriptions" ADD "hash" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp" DROP CONSTRAINT "CHK_6e5d211b507ce4e20fdf4af340_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp" ADD CONSTRAINT "CHK_702c69c05a9d4392405311515e_ENUM" CHECK (type IN ('refresh','reset_password','verify_email','verify_mobile','verify_transaction','newsletter_subscription'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verification" DROP CONSTRAINT "CHK_ee3ef4e1ebb18c927d452eb462_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verification" ADD CONSTRAINT "CHK_4667e09086f46ab87afd428d8d_ENUM" CHECK (reason IN ('refresh','reset_password','verify_email','verify_mobile','verify_transaction','newsletter_subscription'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_verification" ADD CONSTRAINT "CHK_ee3ef4e1ebb18c927d452eb462_ENUM" CHECK (reason IN ('refresh','reset_password','verify_email','verify_mobile','verify_transaction'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verification" DROP CONSTRAINT "CHK_4667e09086f46ab87afd428d8d_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp" ADD CONSTRAINT "CHK_6e5d211b507ce4e20fdf4af340_ENUM" CHECK (type IN ('refresh','reset_password','verify_email','verify_mobile','verify_transaction'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp" DROP CONSTRAINT "CHK_702c69c05a9d4392405311515e_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "newsletter_subscriptions" DROP COLUMN "hash"`,
    );
    await queryRunner.query(
      `ALTER TABLE "newsletter_subscriptions" DROP CONSTRAINT "DF_7c9573043bdbb957d2ebcd439e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "newsletter_subscriptions" DROP COLUMN "isVerified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "newsletter_subscriptions" ADD "meta_data" nvarchar(MAX)`,
    );
  }
}
