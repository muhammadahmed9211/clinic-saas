import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedHashAndIsVerifiedInNewLettersSubscriptions1712564389895
  implements MigrationInterface
{
  name = 'AddedHashAndIsVerifiedInNewLettersSubscriptions1712564389895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "newsletter_subscriptions" ADD "isVerified" bit NOT NULL CONSTRAINT "DF_7c9573043bdbb957d2ebcd439e2" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "newsletter_subscriptions" ADD "hash" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "newsletter_subscriptions" DROP COLUMN "hash"`,
    );
    await queryRunner.query(
      `ALTER TABLE "newsletter_subscriptions" DROP CONSTRAINT "DF_7c9573043bdbb957d2ebcd439e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "newsletter_subscriptions" DROP COLUMN "isVerified"`,
    );
  }
}
