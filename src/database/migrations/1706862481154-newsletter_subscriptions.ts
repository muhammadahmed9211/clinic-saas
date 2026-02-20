import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewsletterSubscriptions1706862481154
  implements MigrationInterface
{
  name = 'NewsletterSubscriptions1706862481154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "newsletter_subscriptions" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "email" nvarchar(255) NOT NULL, "tc_accepted" bit NOT NULL CONSTRAINT "DF_ea3aaf78f8560047a75bbc71172" DEFAULT 1, "created_at" datetime2 NOT NULL CONSTRAINT "DF_50b67bbac945178cd44233fa25b" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_0dcff2298f1b9c561a62b40fd4a" DEFAULT getdate(), "deleted_at" datetime2, CONSTRAINT "PK_cfca9a6e4f146a80a6cd2e76f1d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "newsletter_subscriptions"`);
  }
}
