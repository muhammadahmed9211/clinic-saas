import { MigrationInterface, QueryRunner } from 'typeorm';

export class LeadsCustomStatus21721689056083 implements MigrationInterface {
  name = 'LeadsCustomStatus21721689056083';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesRep"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesPartner"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesOffice"`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "salesDeskId" bigint`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "salesRepId" bigint`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "salesPartnerId" int`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "salesOfficeId" bigint`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_ce4054e83497831bf6a96fae5cc" FOREIGN KEY ("salesDeskId") REFERENCES "desk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_3f8b98bc43c090701c984fd0ae5" FOREIGN KEY ("salesRepId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_2763ed50b7140c311d3a1a9a8da" FOREIGN KEY ("salesPartnerId") REFERENCES "partner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_9bcdcb23d39e8d0cca908a48202" FOREIGN KEY ("salesOfficeId") REFERENCES "office"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_9bcdcb23d39e8d0cca908a48202"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_2763ed50b7140c311d3a1a9a8da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_3f8b98bc43c090701c984fd0ae5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_ce4054e83497831bf6a96fae5cc"`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesOfficeId"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesPartnerId"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesRepId"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesDeskId"`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "salesOffice" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "salesPartner" varchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "lead" ADD "salesRep" varchar(255)`);
  }
}
