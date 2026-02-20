import { MigrationInterface, QueryRunner } from 'typeorm';

export class KycQuestionaire1704779927881 implements MigrationInterface {
  name = 'KycQuestionaire1704779927881';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "question" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(255) NOT NULL, "desc" nvarchar(255), "type" nvarchar(255) NOT NULL, "isHidden" bit NOT NULL, "isRequired" bit NOT NULL, "isEditable" bit NOT NULL, "isDeleted" bit NOT NULL CONSTRAINT "DF_f574dd610880a60f51ac4b0592a" DEFAULT 0, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "answer" ("id" int NOT NULL IDENTITY(1,1), "text" nvarchar(255) NOT NULL, "sort" int NOT NULL, "questionId" int, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`,
    );
    await queryRunner.query(`DROP TABLE "answer"`);
    await queryRunner.query(`DROP TABLE "question"`);
  }
}
