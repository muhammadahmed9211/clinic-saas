import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFile1711490128344 implements MigrationInterface {
  name = 'AlterFile1711490128344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" ADD "fileType" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "file" ADD "userId" int`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_b2d8e683f020f61115edea206b3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_b2d8e683f020f61115edea206b3"`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "fileType"`);
  }
}
