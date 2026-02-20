import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerJoinUpdat1717596550799 implements MigrationInterface {
  name = 'PartnerJoinUpdat1717596550799';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner_links" ADD "partnerId" int`);
    await queryRunner.query(
      `ALTER TABLE "partner_links" ADD CONSTRAINT "FK_ccdb5abcac78cb9650285df9a4a" FOREIGN KEY ("partnerId") REFERENCES "partner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP CONSTRAINT "FK_ccdb5abcac78cb9650285df9a4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP COLUMN "partnerId"`,
    );
  }
}
