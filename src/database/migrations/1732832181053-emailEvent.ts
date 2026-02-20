import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailEvent1732832181053 implements MigrationInterface {
    name = 'EmailEvent1732832181053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_event" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_43fa31fea6a47f2d55d8d1a3e7f" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_d852e841312f1aab2c158158e33" DEFAULT getdate(), "deletedAt" datetime2, "createdById" int, CONSTRAINT "UQ_c781b0846adac9d0f0c13850f0e" UNIQUE ("name", "deletedAt"), CONSTRAINT "PK_6620d7d3a9919b2ca7b12ba423e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email_mapping" ("id" int NOT NULL IDENTITY(1,1), "langCode" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_a52d42f4e114d15c2e4bc3937b5" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_832cefa8ebdbe0fff0c3408dd57" DEFAULT getdate(), "deletedAt" datetime2, "emailEventId" int, "regulationId" int, "headerFooterId" int, "bodyContentId" int, CONSTRAINT "UQ_0f0d2b1ebf361c51beb22adaa89" UNIQUE ("langCode", "regulationId", "deletedAt"), CONSTRAINT "PK_6f54f60280845688f660e77d9b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "email_event" ADD CONSTRAINT "FK_67b1b3a0db2eddb9fece32d2a5b" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_mapping" ADD CONSTRAINT "FK_9f5bd2e8414efc89f64d5f31595" FOREIGN KEY ("emailEventId") REFERENCES "email_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_mapping" ADD CONSTRAINT "FK_a418c6d202fdf45f90c8274a20f" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_mapping" ADD CONSTRAINT "FK_4f0e3890b531159ac068c63890d" FOREIGN KEY ("headerFooterId") REFERENCES "layout"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_mapping" ADD CONSTRAINT "FK_77ab1a5daec868b4880360b11e5" FOREIGN KEY ("bodyContentId") REFERENCES "template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_mapping" DROP CONSTRAINT "UQ_0f0d2b1ebf361c51beb22adaa89"`);
        await queryRunner.query(`ALTER TABLE "email_mapping" ADD CONSTRAINT "UQ_aebd2b0f080c0f9eff99dbc505d" UNIQUE ("langCode", "regulationId", "deletedAt", "emailEventId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_mapping" DROP CONSTRAINT "FK_77ab1a5daec868b4880360b11e5"`);
        await queryRunner.query(`ALTER TABLE "email_mapping" DROP CONSTRAINT "FK_4f0e3890b531159ac068c63890d"`);
        await queryRunner.query(`ALTER TABLE "email_mapping" DROP CONSTRAINT "FK_a418c6d202fdf45f90c8274a20f"`);
        await queryRunner.query(`ALTER TABLE "email_mapping" DROP CONSTRAINT "FK_9f5bd2e8414efc89f64d5f31595"`);
        await queryRunner.query(`ALTER TABLE "email_event" DROP CONSTRAINT "FK_67b1b3a0db2eddb9fece32d2a5b"`);
        await queryRunner.query(`DROP TABLE "email_mapping"`);
        await queryRunner.query(`DROP TABLE "email_event"`);
    }

}
