import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketsEntity1734440691394 implements MigrationInterface {
    name = 'TicketsEntity1734440691394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "DF_275bc4c6ad392321918a8265038"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "CreatedFor"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "createdForId"`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "createdFor" nvarchar(255) CONSTRAINT CHK_a240bd01734ebed758a5d565eb_ENUM CHECK(createdFor IN ('CLIENT','OPERATOR')) CONSTRAINT "DF_d99af3c0d92dcab3352d609cde3" DEFAULT 'OPERATOR'`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "createdForIdId" int`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_bee9aa220bceadc436a54a16422" FOREIGN KEY ("createdForIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_bee9aa220bceadc436a54a16422"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "createdForIdId"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "DF_d99af3c0d92dcab3352d609cde3"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "createdFor"`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "createdForId" int`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "CreatedFor" nvarchar(255) CONSTRAINT CHK_a3beb921c4b20021ec4118f337_ENUM CHECK(CreatedFor IN ('LEAD','CLIENT','OPERATOR'))`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "DF_275bc4c6ad392321918a8265038" DEFAULT 'OPERATOR' FOR "CreatedFor"`);
    }

}
