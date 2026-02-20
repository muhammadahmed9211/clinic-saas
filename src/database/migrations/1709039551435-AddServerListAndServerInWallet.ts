import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddServerListAndServerInWallet1709039551435
  implements MigrationInterface
{
  name = 'AddServerListAndServerInWallet1709039551435';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_6221727977a9186441e0811cb6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ALTER COLUMN "serverId" uniqueidentifier`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_6221727977a9186441e0811cb6f" FOREIGN KEY ("serverId") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_6221727977a9186441e0811cb6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ALTER COLUMN "serverId" uniqueidentifier NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_6221727977a9186441e0811cb6f" FOREIGN KEY ("serverId") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
