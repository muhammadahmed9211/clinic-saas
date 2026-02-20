import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedLeadTableWithClientColumns1722950109598
  implements MigrationInterface
{
  name = 'UpdatedLeadTableWithClientColumns1722950109598';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_3f8b98bc43c090701c984fd0ae5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_ce4054e83497831bf6a96fae5cc"`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesManager"`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "countryIso" varchar(255)`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "salesDesk" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "salesRep" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "retentionDeskId" int`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "retentionDesk" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "lead" ADD "retentionRepId" int`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "retentionRep" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "lead" ADD "supportDeskId" int`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "supportDesk" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "lead" ADD "supportRepId" int`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "supportRep" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "lead" ADD "financeDeskId" int`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "financeDesk" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "lead" ADD "financeRepId" int`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "financeRep" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "lead" ADD "officeId" int`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "office" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "kycDeskId" int`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "kycDesk" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "kycRepId" int`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "kycRep" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesDeskId"`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "salesDeskId" int`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesRepId"`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "salesRepId" int`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesRepId"`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "salesRepId" bigint`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesDeskId"`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "salesDeskId" bigint`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "kycRep"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "kycRepId"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "kycDesk"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "kycDeskId"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "office"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "officeId"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "financeRep"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "financeRepId"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "financeDesk"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "financeDeskId"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "supportRep"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "supportRepId"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "supportDesk"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "supportDeskId"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "retentionRep"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "retentionRepId"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "retentionDesk"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "retentionDeskId"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesRep"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesDesk"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "countryIso"`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "salesManager" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_ce4054e83497831bf6a96fae5cc" FOREIGN KEY ("salesDeskId") REFERENCES "desk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_3f8b98bc43c090701c984fd0ae5" FOREIGN KEY ("salesRepId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
