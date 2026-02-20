import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTableBillingInformation1709224860499
  implements MigrationInterface
{
  name = 'AddTableBillingInformation1709224860499';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "billing_information" ("id" int NOT NULL IDENTITY(1,1), "name" varchar(100) NOT NULL, "country" varchar(100) NOT NULL, "city" varchar(100) NOT NULL, "address" varchar(100) NOT NULL, "phone" varchar(100) NOT NULL, "postalCode" varchar(100) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_c5b24159ac380e5079756b35412" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_7d0bee2347e718f0f61516d6092" DEFAULT getdate(), "userId" int, CONSTRAINT "PK_25e42e1e9925a747e00710d9a27" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "billing_information" ADD CONSTRAINT "FK_1ee211f9044456933891670483a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "billing_information" DROP CONSTRAINT "FK_1ee211f9044456933891670483a"`,
    );
    await queryRunner.query(`DROP TABLE "billing_information"`);
  }
}
