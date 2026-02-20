import { MigrationInterface, QueryRunner } from 'typeorm';

export class OperatorBooleanEntityUpdate1715687341562
  implements MigrationInterface
{
  name = 'OperatorBooleanEntityUpdate1715687341562';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1715687346351 FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1715687347932 FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "DF_916ed2a12c81d2468b16715443a"`,
    );
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "is_active"`);
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "is_active" bit NOT NULL CONSTRAINT "DF_916ed2a12c81d2468b16715443a" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "DF_f7de8e6e2d7a050a1b08fca7973"`,
    );
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "is_deleted"`);
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "is_deleted" bit NOT NULL CONSTRAINT "DF_f7de8e6e2d7a050a1b08fca7973" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "DF_734ac5bcd112abf8498b6da8208"`,
    );
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "is_blocked"`);
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "is_blocked" bit NOT NULL CONSTRAINT "DF_734ac5bcd112abf8498b6da8208" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "DF_4878e672e33a9fc608b96a09d85"`,
    );
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "is_test"`);
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "is_test" bit NOT NULL CONSTRAINT "DF_4878e672e33a9fc608b96a09d85" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "DF_4878e672e33a9fc608b96a09d85"`,
    );
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "is_test"`);
    await queryRunner.query(`ALTER TABLE "operator" ADD "is_test" tinyint`);
    await queryRunner.query(
      `ALTER TABLE "operator" ADD CONSTRAINT "DF_4878e672e33a9fc608b96a09d85" DEFAULT 0 FOR "is_test"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "DF_734ac5bcd112abf8498b6da8208"`,
    );
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "is_blocked"`);
    await queryRunner.query(`ALTER TABLE "operator" ADD "is_blocked" tinyint`);
    await queryRunner.query(
      `ALTER TABLE "operator" ADD CONSTRAINT "DF_734ac5bcd112abf8498b6da8208" DEFAULT 0 FOR "is_blocked"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "DF_f7de8e6e2d7a050a1b08fca7973"`,
    );
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "is_deleted"`);
    await queryRunner.query(`ALTER TABLE "operator" ADD "is_deleted" tinyint`);
    await queryRunner.query(
      `ALTER TABLE "operator" ADD CONSTRAINT "DF_f7de8e6e2d7a050a1b08fca7973" DEFAULT 0 FOR "is_deleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "DF_916ed2a12c81d2468b16715443a"`,
    );
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "is_active"`);
    await queryRunner.query(`ALTER TABLE "operator" ADD "is_active" tinyint`);
    await queryRunner.query(
      `ALTER TABLE "operator" ADD CONSTRAINT "DF_916ed2a12c81d2468b16715443a" DEFAULT 1 FOR "is_active"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1715686143250. FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1715686141609. FOR "dateTime"`,
    );
  }
}
