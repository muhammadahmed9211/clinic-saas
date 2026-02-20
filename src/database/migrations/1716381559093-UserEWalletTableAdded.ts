import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEWalletTableAdded1716381559093 implements MigrationInterface {
  name = 'UserEWalletTableAdded1716381559093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user-e-wallet" ("id" int NOT NULL IDENTITY(1,1), "name" varchar(255) NOT NULL, "title" varchar(255) NOT NULL, "eWalletId" varchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_02a6c6e90e9596473ddfbe890bb" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_58bdd9454fd3b00e4b4c583573d" DEFAULT getdate(), "deletedAt" datetime2, "userId" int NOT NULL, CONSTRAINT "PK_2b7ff3dfe140d9a28b0d8beb336" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-e-wallet" ADD CONSTRAINT "FK_d5c532e0c4b809cf8b1d86b663b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reset_password" DROP CONSTRAINT "FK_6315a559e0b7920bdbdf142e306"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-e-wallet" DROP CONSTRAINT "FK_d5c532e0c4b809cf8b1d86b663b"`,
    );
    await queryRunner.query(`DROP TABLE "user-e-wallet"`);
    await queryRunner.query(
      `ALTER TABLE "reset_password" ADD CONSTRAINT "FK_20b304cde809f95a03deb52a895" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
