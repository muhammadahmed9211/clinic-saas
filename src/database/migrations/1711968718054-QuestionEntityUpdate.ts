import { MigrationInterface, QueryRunner } from 'typeorm';

export class QuestionEntityUpdate1711968718054 implements MigrationInterface {
  name = 'QuestionEntityUpdate1711968718054';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "question" ADD "title" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "desc"`);
    await queryRunner.query(`ALTER TABLE "question" ADD "desc" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1711968727207 FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1711968727505 FOR "dateTime"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1711964542584. FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1711964542463. FOR "dateTime"`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "desc"`);
    await queryRunner.query(`ALTER TABLE "question" ADD "desc" text`);
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "question" ADD "title" text NOT NULL`);
  }
}
