import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFunnelHistory1721384514806 implements MigrationInterface {
  name = 'CreateFunnelHistory1721384514806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "funnel_history" ("id" int NOT NULL IDENTITY(1,1), "stage" nvarchar(255) NOT NULL, "amount" int NOT NULL, "probability" nvarchar(255) NOT NULL, "expectedInvestment" float NOT NULL, "closingDate" datetime NOT NULL, "stageDuration" int NOT NULL, "ModifiedBy" nvarchar(255) NOT NULL, "ModifyTime" datetime NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_3eabfc4366d63ac60eb94d96360" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_086679f7ab06e8782fdc5bdfe82" DEFAULT getdate(), "opportunityId" int, CONSTRAINT "PK_2766b94819bd16ee63f8329b975" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "funnel_history" ADD CONSTRAINT "FK_bec9fbb2cba9a7090a3e849d42d" FOREIGN KEY ("opportunityId") REFERENCES "opportunity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funnel_history" DROP CONSTRAINT "FK_bec9fbb2cba9a7090a3e849d42d"`,
    );
    await queryRunner.query(`DROP TABLE "funnel_history"`);
  }
}
