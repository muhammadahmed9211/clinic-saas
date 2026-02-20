import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTranscationEventsTable1715941439206
  implements MigrationInterface
{
  name = 'AddedTranscationEventsTable1715941439206';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction_events" ("id" int NOT NULL IDENTITY(1,1), "payload" text NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_e5bd8d040ceb9b87deae0a868a1" DEFAULT getdate(), "transactionId" uniqueidentifier, CONSTRAINT "PK_e0b1cdc84612e5aebf6e6273ff4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_events" ADD CONSTRAINT "FK_9f7f6d0b1f927a1808025877da6" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_events" DROP CONSTRAINT "FK_9f7f6d0b1f927a1808025877da6"`,
    );
    await queryRunner.query(`DROP TABLE "transaction_events"`);
  }
}
