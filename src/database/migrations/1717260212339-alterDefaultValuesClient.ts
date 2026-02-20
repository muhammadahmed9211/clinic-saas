import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterDefaultValuesClient1717260212339
  implements MigrationInterface
{
  name = 'AlterDefaultValuesClient1717260212339';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_ee77d0dd324463bf84b951ff4af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_8d34c5f89d637582108be9a3a05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_2a7a4a476922ad985539ade4962"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_da31b62cf586af6a626f0e4a050"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_0f5c8966c2278b5afedbb692d46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_ee77d0dd324463bf84b951ff4af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_3ebafa70de4261bf4b7734e0a07"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_9434598520ac5d72195a0be4fd0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_2c87f1037220630738df55004ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_8d34c5f89d637582108be9a3a05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_c39c8110d6c8e7892e82537a2be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_ea50ace9b57f5a531307812e460"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_f54cf1faf47e0ba860e3b2aea05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_dd75993c164d904f773ffe2e361"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_e6700befe84e18f5f06c4334481"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_389f90b5bd61b005c59ad4b80d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_ee77d0dd324463bf84b951ff4af" FOREIGN KEY ("internalSalesStatus") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_8d34c5f89d637582108be9a3a05" FOREIGN KEY ("internalRetentionStatus") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_8d34c5f89d637582108be9a3a05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_ee77d0dd324463bf84b951ff4af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_389f90b5bd61b005c59ad4b80d4" DEFAULT 1 FOR "kycRepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_e6700befe84e18f5f06c4334481" DEFAULT 1 FOR "kycDeskId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_dd75993c164d904f773ffe2e361" DEFAULT 1 FOR "financeRepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_f54cf1faf47e0ba860e3b2aea05" DEFAULT 1 FOR "financeDeskId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_ea50ace9b57f5a531307812e460" DEFAULT 1 FOR "supportRepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_c39c8110d6c8e7892e82537a2be" DEFAULT 1 FOR "supportDeskId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_8d34c5f89d637582108be9a3a05" DEFAULT 1 FOR "internalRetentionStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_2c87f1037220630738df55004ee" DEFAULT 1 FOR "retentionRepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_9434598520ac5d72195a0be4fd0" DEFAULT 1 FOR "retentionDeskId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_3ebafa70de4261bf4b7734e0a07" DEFAULT 1 FOR "firstRetinationRep"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_ee77d0dd324463bf84b951ff4af" DEFAULT 1 FOR "internalSalesStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_0f5c8966c2278b5afedbb692d46" DEFAULT 1 FOR "salesRepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_da31b62cf586af6a626f0e4a050" DEFAULT 1 FOR "officeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_2a7a4a476922ad985539ade4962" DEFAULT 1 FOR "salesDeskId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_8d34c5f89d637582108be9a3a05" FOREIGN KEY ("internalRetentionStatus") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_ee77d0dd324463bf84b951ff4af" FOREIGN KEY ("internalSalesStatus") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
