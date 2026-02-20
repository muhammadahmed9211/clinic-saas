import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterClientEntitites1717243637376 implements MigrationInterface {
  name = 'AlterClientEntitites1717243637376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "salesStatus"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "retentionStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "officeId" int CONSTRAINT "DF_da31b62cf586af6a626f0e4a050" DEFAULT 1`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "office" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "retentionDeskId" int CONSTRAINT "DF_9434598520ac5d72195a0be4fd0" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "retentionRepId" int CONSTRAINT "DF_2c87f1037220630738df55004ee" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "supportDeskId" int CONSTRAINT "DF_c39c8110d6c8e7892e82537a2be" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "supportDesk" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "supportRepId" int CONSTRAINT "DF_ea50ace9b57f5a531307812e460" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "supportRep" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "financeDeskId" int CONSTRAINT "DF_f54cf1faf47e0ba860e3b2aea05" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "financeDesk" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "financeRepId" int CONSTRAINT "DF_dd75993c164d904f773ffe2e361" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "financeRep" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "kycDeskId" int CONSTRAINT "DF_e6700befe84e18f5f06c4334481" DEFAULT 1`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "kycDesk" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "kycRepId" int CONSTRAINT "DF_389f90b5bd61b005c59ad4b80d4" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "suppoertStatusId" int CONSTRAINT "DF_5665e60869769324c19bbec1aa1" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "supportStatus" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "financeStatusId" int CONSTRAINT "DF_71307f2762342b0d91ba584e761" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "financeStatus" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_ee77d0dd324463bf84b951ff4af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_8d34c5f89d637582108be9a3a05"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "affid"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "affid" int`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_2a7a4a476922ad985539ade4962"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_2a7a4a476922ad985539ade4962" DEFAULT 1 FOR "salesDeskId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_0f5c8966c2278b5afedbb692d46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_0f5c8966c2278b5afedbb692d46" DEFAULT 1 FOR "salesRepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_ee77d0dd324463bf84b951ff4af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_ee77d0dd324463bf84b951ff4af" DEFAULT 1 FOR "internalSalesStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_3ebafa70de4261bf4b7734e0a07"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_3ebafa70de4261bf4b7734e0a07" DEFAULT 1 FOR "firstRetinationRep"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_d57a8bbee44d5e7b0938ee6bd7c"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "retentionDesk"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "retentionDesk" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_9368013cea77e433cbfad71134f"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "retentionRep"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "retentionRep" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_8d34c5f89d637582108be9a3a05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_8d34c5f89d637582108be9a3a05" DEFAULT 1 FOR "internalRetentionStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_ee77d0dd324463bf84b951ff4af" FOREIGN KEY ("internalSalesStatus") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_8d34c5f89d637582108be9a3a05" FOREIGN KEY ("internalRetentionStatus") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_59e354e005ed56e3765fe7b7c30" FOREIGN KEY ("affid") REFERENCES "partner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_59e354e005ed56e3765fe7b7c30"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_8d34c5f89d637582108be9a3a05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_ee77d0dd324463bf84b951ff4af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_8d34c5f89d637582108be9a3a05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_8d34c5f89d637582108be9a3a05" DEFAULT 0 FOR "internalRetentionStatus"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "retentionRep"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "retentionRep" int`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_9368013cea77e433cbfad71134f" DEFAULT 0 FOR "retentionRep"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "retentionDesk"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "retentionDesk" int`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_d57a8bbee44d5e7b0938ee6bd7c" DEFAULT 0 FOR "retentionDesk"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_3ebafa70de4261bf4b7734e0a07"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_3ebafa70de4261bf4b7734e0a07" DEFAULT 0 FOR "firstRetinationRep"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_ee77d0dd324463bf84b951ff4af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_ee77d0dd324463bf84b951ff4af" DEFAULT 0 FOR "internalSalesStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_0f5c8966c2278b5afedbb692d46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_0f5c8966c2278b5afedbb692d46" DEFAULT 0 FOR "salesRepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_2a7a4a476922ad985539ade4962"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_2a7a4a476922ad985539ade4962" DEFAULT 0 FOR "salesDeskId"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "affid"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "affid" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_8d34c5f89d637582108be9a3a05" FOREIGN KEY ("internalRetentionStatus") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_ee77d0dd324463bf84b951ff4af" FOREIGN KEY ("internalSalesStatus") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "financeStatus"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_71307f2762342b0d91ba584e761"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "financeStatusId"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "supportStatus"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_5665e60869769324c19bbec1aa1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "suppoertStatusId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_389f90b5bd61b005c59ad4b80d4"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "kycRepId"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "kycDesk"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_e6700befe84e18f5f06c4334481"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "kycDeskId"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "financeRep"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_dd75993c164d904f773ffe2e361"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "financeRepId"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "financeDesk"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_f54cf1faf47e0ba860e3b2aea05"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "financeDeskId"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "supportRep"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_ea50ace9b57f5a531307812e460"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "supportRepId"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "supportDesk"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_c39c8110d6c8e7892e82537a2be"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "supportDeskId"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_2c87f1037220630738df55004ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "retentionRepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_9434598520ac5d72195a0be4fd0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "retentionDeskId"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "office"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_da31b62cf586af6a626f0e4a050"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "officeId"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "retentionStatus" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "salesStatus" nvarchar(255)`,
    );
  }
}
