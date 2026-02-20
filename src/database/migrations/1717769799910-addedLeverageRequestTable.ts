import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedLeverageRequestTable1717769799910
  implements MigrationInterface
{
  name = 'AddedLeverageRequestTable1717769799910';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "leverage_request" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_cb3b2dc560154fd7132c648cac1" DEFAULT NEWSEQUENTIALID(), "tradingAccount" nvarchar(255) NOT NULL, "leverage" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_81e945c3e294060645965bae125" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_2a463215575d77d27909b15ee21" DEFAULT getdate(), "deletedAt" datetime2, "userId" int, CONSTRAINT "PK_cb3b2dc560154fd7132c648cac1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "leverage_request" ADD CONSTRAINT "FK_568f164a852281b3f637319988f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leverage_request" DROP CONSTRAINT "FK_568f164a852281b3f637319988f"`,
    );
    await queryRunner.query(`DROP TABLE "leverage_request"`);
  }
}
