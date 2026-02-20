import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUserInExhange1726835621079 implements MigrationInterface {
  name = 'AddedUserInExhange1726835621079';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exchange" ADD CONSTRAINT "FK_498f5c1f572c87e9dae98b76eb9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exchange" DROP CONSTRAINT "FK_498f5c1f572c87e9dae98b76eb9"`,
    );
    await queryRunner.query(`ALTER TABLE "exchange" DROP COLUMN "userId"`);
  }
}
