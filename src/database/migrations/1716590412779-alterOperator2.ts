import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterOperator21716590412779 implements MigrationInterface {
  name = 'AlterOperator21716590412779';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_3179be2e8b1771a4f0fb9e7102a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "photoId" uniqueidentifier`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "creator_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "creator_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_3179be2e8b1771a4f0fb9e7102a" FOREIGN KEY ("creator_id") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ADD CONSTRAINT "FK_7081f1c5236ffc5996a15cc2f77" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_c55aabb164a3d486ff2e1a9b32e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "FK_7081f1c5236ffc5996a15cc2f77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_3179be2e8b1771a4f0fb9e7102a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "creator_id"`,
    );
    await queryRunner.query(`ALTER TABLE "notifications" ADD "creator_id" int`);
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "photoId"`);
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "photoId"`);
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_3179be2e8b1771a4f0fb9e7102a" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
