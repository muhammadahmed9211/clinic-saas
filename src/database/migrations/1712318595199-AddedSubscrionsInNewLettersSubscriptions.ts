import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedSubscrionsInNewLettersSubscriptions1712318595199
  implements MigrationInterface
{
  name = 'AddedSubscrionsInNewLettersSubscriptions1712318595199';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "newsletter_subscriptions" ADD "subscriptions" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "newsletter_subscriptions" DROP COLUMN "subscriptions"`,
    );
  }
}
