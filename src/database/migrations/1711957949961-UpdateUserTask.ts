import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTask1711957949961 implements MigrationInterface {
  name = 'UpdateUserTask1711957949961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "label" DROP CONSTRAINT "FK_95b51e724358ed4a38159645135"`,
    );
    await queryRunner.query(`ALTER TABLE "label" DROP COLUMN "userTaskId"`);
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1711957954974 FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1711957955085 FOR "dateTime"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1711956452532. FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1711956452282. FOR "dateTime"`,
    );
    await queryRunner.query(`ALTER TABLE "label" ADD "userTaskId" int`);
    await queryRunner.query(
      `ALTER TABLE "label" ADD CONSTRAINT "FK_95b51e724358ed4a38159645135" FOREIGN KEY ("userTaskId") REFERENCES "user_task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
