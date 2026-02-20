import { MigrationInterface, QueryRunner } from "typeorm";

export class CommunicationUpdate1741256303269 implements MigrationInterface {
    name = 'CommunicationUpdate1741256303269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "communication" ADD "updatedById" bigint`);
        await queryRunner.query(`ALTER TABLE "communication" ALTER COLUMN "operatorId" bigint NULL`);
        await queryRunner.query(`ALTER TABLE "communication" ADD CONSTRAINT "FK_9f1196f774c6ef5a3e91c2a05df" FOREIGN KEY ("operatorId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "communication" ADD CONSTRAINT "FK_10cd061b6dbd1d6ad466acb924f" FOREIGN KEY ("updatedById") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "communication" DROP CONSTRAINT "FK_10cd061b6dbd1d6ad466acb924f"`);
        await queryRunner.query(`ALTER TABLE "communication" DROP CONSTRAINT "FK_9f1196f774c6ef5a3e91c2a05df"`);
        await queryRunner.query(`ALTER TABLE "communication" ALTER COLUMN "operatorId" int`);
        await queryRunner.query(`ALTER TABLE "communication" DROP COLUMN "updatedById"`);
    }

}
