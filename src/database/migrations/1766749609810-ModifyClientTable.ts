import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyClientTable1766749609810 implements MigrationInterface {
  name = 'ModifyClientTable1766749609810';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "typeIb" bit NOT NULL CONSTRAINT "DF_b38a9d5dd320eddeb8307549394" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_b38a9d5dd320eddeb8307549394"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "typeIb"`);
  }
}
