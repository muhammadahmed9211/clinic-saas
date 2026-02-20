import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionTableAltered1718556423321
  implements MigrationInterface
{
  name = 'TransactionTableAltered1718556423321';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_3b1df296984a6576ac81fe29521"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_ecd7ffc6e69e97a63ed800a8098"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_1c0d92a491b73292a10dd2ee620"`,
    );

    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "pspAccountNo" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "brokerExternalId" text`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" ADD "reconcile" bit`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "paymentClientName" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "authenticationAlert" nvarchar(255) NOT NULL CONSTRAINT "DF_f9c2cb4b4a3da221e53b78f45f6" DEFAULT 'MEDIUM'`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" ADD "kycRepId" int`);

    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "retentionRepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "retentionRepId" int`,
    );

    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "actionById"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" ADD "actionById" int`);

    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "salesRepId"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" ADD "salesRepId" int`);

    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_2cae01060a72c5a91bbe26f1973" FOREIGN KEY ("kycRepId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_1c0d92a491b73292a10dd2ee620" FOREIGN KEY ("actionById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_ecd7ffc6e69e97a63ed800a8098" FOREIGN KEY ("salesRepId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_3b1df296984a6576ac81fe29521" FOREIGN KEY ("retentionRepId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_3b1df296984a6576ac81fe29521"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_ecd7ffc6e69e97a63ed800a8098"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_1c0d92a491b73292a10dd2ee620"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_2cae01060a72c5a91bbe26f1973"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "retentionRepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "retentionRepId" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "salesRepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "salesRepId" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "actionById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "actionById" bigint`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "kycRepId"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "DF_f9c2cb4b4a3da221e53b78f45f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "authenticationAlert"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "paymentClientName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "reconcile"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "brokerExternalId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "pspAccountNo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_1c0d92a491b73292a10dd2ee620" FOREIGN KEY ("actionById") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_ecd7ffc6e69e97a63ed800a8098" FOREIGN KEY ("salesRepId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_3b1df296984a6576ac81fe29521" FOREIGN KEY ("retentionRepId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
