import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedAggregatorAndAlteredPSP1723029690964
  implements MigrationInterface
{
  name = 'AddedAggregatorAndAlteredPSP1723029690964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "aggregator_psp" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "displayName" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "isActive" bit NOT NULL CONSTRAINT "DF_e823e38cddd6bbfd87c812c8dd9" DEFAULT 1, "fee" float NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_fad160cf70a60f9ffd776218f90" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_958bbe6fd197a15af3fa299f152" DEFAULT getdate(), "deletedAt" datetime2, "userId" int, CONSTRAINT "PK_cb2d2e0809181ffb70650fb08a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "aggregator_psp" ADD CONSTRAINT "FK_0b90eeb8d10903afe4e02faab8d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "psp" ADD "aggregatorName" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" ADD "type" nvarchar(255) NOT NULL CONSTRAINT "DF_affdf8770b1440d3568d450261a" DEFAULT 'ALL'`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" ADD "depositFeeType" nvarchar(255) NOT NULL CONSTRAINT "DF_0b936e8b41e8c7a1e380d8d8db2" DEFAULT 'AMOUNT'`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" ADD "depositFee" float NOT NULL CONSTRAINT "DF_ab401f2bc2a03fdaa6d69bad8d8" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" ADD "withdrawalFeeType" nvarchar(255) NOT NULL CONSTRAINT "DF_b16304f0e55c07ecb4b33243947" DEFAULT 'AMOUNT'`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" ADD "withdrawalFee" float NOT NULL CONSTRAINT "DF_eb8b3ae9328905f743ef44f64f2" DEFAULT 0`,
    );

    await queryRunner.query(
      `ALTER TABLE "psp" ADD "clientDepositFeeType" nvarchar(255) NOT NULL CONSTRAINT "DF_b2938fb95f225db332cb5268e87" DEFAULT 'AMOUNT'`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" ADD "clientDepositFee" float NOT NULL CONSTRAINT "DF_2f9cdae56d8887df8449a1a2b4a" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" ADD "clientWithdrawalFeeType" nvarchar(255) NOT NULL CONSTRAINT "DF_cb96929dd66dfe2824ebfe34637" DEFAULT 'AMOUNT'`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" ADD "clientWithdrawalFee" float NOT NULL CONSTRAINT "DF_becef68043301296a7145d3d885" DEFAULT 0`,
    );

    await queryRunner.query(
      `ALTER TABLE "psp" ADD "depositLimit" float NOT NULL CONSTRAINT "DF_c96446c30344f98c614666dcdf7" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" ADD "withdrawalLimit" float NOT NULL CONSTRAINT "DF_d8d90d4c1b9dbe955b0b660852d" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" ADD "rolloverType" nvarchar(255) NOT NULL CONSTRAINT "DF_a39816034c6826f2f647e456437" DEFAULT 'PERCENTAGE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" ADD "rollover" float NOT NULL CONSTRAINT "DF_59951a9f396d4c34ac4636d3ac1" DEFAULT 0`,
    );

    await queryRunner.query(`ALTER TABLE "psp" ADD "aggregatorId" int`);
    await queryRunner.query(`ALTER TABLE "psp" ADD "userId" int`);

    await queryRunner.query(
      `ALTER TABLE "psp" ADD CONSTRAINT "FK_af2faeabda09d12b091efb53f8a" FOREIGN KEY ("aggregatorId") REFERENCES "aggregator_psp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" ADD CONSTRAINT "FK_cd8ea93cb1ecacfe05da33eb1e7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "FK_cd8ea93cb1ecacfe05da33eb1e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "FK_af2faeabda09d12b091efb53f8a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "aggregator_psp" DROP CONSTRAINT "FK_0b90eeb8d10903afe4e02faab8d"`,
    );
    await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "aggregatorId"`);
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "DF_59951a9f396d4c34ac4636d3ac1"`,
    );
    await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "rollover"`);
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "DF_a39816034c6826f2f647e456437"`,
    );
    await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "rolloverType"`);
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "DF_d8d90d4c1b9dbe955b0b660852d"`,
    );
    await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "withdrawalLimit"`);
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "DF_c96446c30344f98c614666dcdf7"`,
    );
    await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "depositLimit"`);
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "DF_becef68043301296a7145d3d885"`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" DROP COLUMN "clientWithdrawalFee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "DF_cb96929dd66dfe2824ebfe34637"`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" DROP COLUMN "clientWithdrawalFeeType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "DF_2f9cdae56d8887df8449a1a2b4a"`,
    );
    await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "clientDepositFee"`);
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "DF_b2938fb95f225db332cb5268e87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" DROP COLUMN "clientDepositFeeType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "DF_eb8b3ae9328905f743ef44f64f2"`,
    );
    await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "withdrawalFee"`);
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "DF_b16304f0e55c07ecb4b33243947"`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" DROP COLUMN "withdrawalFeeType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "DF_ab401f2bc2a03fdaa6d69bad8d8"`,
    );
    await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "depositFee"`);
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "DF_0b936e8b41e8c7a1e380d8d8db2"`,
    );
    await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "depositFeeType"`);
    await queryRunner.query(
      `ALTER TABLE "psp" DROP CONSTRAINT "DF_affdf8770b1440d3568d450261a"`,
    );
    await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "aggregatorName"`);
    await queryRunner.query(`DROP TABLE "aggregator_psp"`);
  }
}
