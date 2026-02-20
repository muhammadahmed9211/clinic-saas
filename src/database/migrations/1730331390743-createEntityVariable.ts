import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEntityVariable1730331390743 implements MigrationInterface {
    name = 'CreateEntityVariable1730331390743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_entity" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "created_at" datetime NOT NULL CONSTRAINT "DF_4637df427c57531473f44ddc280" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_3ed1f5cf84606151d57225df869" DEFAULT getdate(), "deleted_at" datetime, CONSTRAINT "PK_2173737e965d2e86cfe7ad16d28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email_variable" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "created_at" datetime NOT NULL CONSTRAINT "DF_8acc6682e4f6bab970d4c0a98c8" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_8ae656a95054b39c54b621ad80b" DEFAULT getdate(), "deleted_at" datetime, "emailEntityId" int, CONSTRAINT "PK_cecb6eab9c609237a6f39193ed8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "email_variable" ADD CONSTRAINT "FK_6b516edb62d33d7531f9e1b4b19" FOREIGN KEY ("emailEntityId") REFERENCES "email_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_variable" DROP CONSTRAINT "FK_6b516edb62d33d7531f9e1b4b19"`);
        await queryRunner.query(`DROP TABLE "email_variable"`);
        await queryRunner.query(`DROP TABLE "email_entity"`);
    }

}
