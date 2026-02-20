import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOperatorSession1716384914213 implements MigrationInterface {
  name = 'CreateOperatorSession1716384914213';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reset_password" DROP CONSTRAINT "FK_20b304cde809f95a03deb52a895"`,
    );
    await queryRunner.query(
      `CREATE TABLE "operator_session" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_121ba452499010884fc5a0e63ac" DEFAULT getdate(), "deletedAt" datetime2, "operatorId" bigint, CONSTRAINT "PK_3d0dc224191e7dc8af380a42b0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ff376c7489a50f059c6b6a756" ON "operator_session" ("operatorId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_session" ADD CONSTRAINT "FK_0ff376c7489a50f059c6b6a7561" FOREIGN KEY ("operatorId") REFERENCES "operator"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reset_password" ADD CONSTRAINT "FK_6315a559e0b7920bdbdf142e306" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reset_password" DROP CONSTRAINT "FK_6315a559e0b7920bdbdf142e306"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_session" DROP CONSTRAINT "FK_0ff376c7489a50f059c6b6a7561"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_0ff376c7489a50f059c6b6a756" ON "operator_session"`,
    );
    await queryRunner.query(`DROP TABLE "operator_session"`);
    await queryRunner.query(
      `ALTER TABLE "reset_password" ADD CONSTRAINT "FK_20b304cde809f95a03deb52a895" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
