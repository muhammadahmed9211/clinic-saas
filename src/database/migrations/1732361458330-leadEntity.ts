import { MigrationInterface, QueryRunner } from "typeorm";

export class LeadEntity1732361458330 implements MigrationInterface {
    name = 'LeadEntity1732361458330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" ADD "retentionStatusId" int`);
        await queryRunner.query(`ALTER TABLE "lead" ADD CONSTRAINT "FK_10d69ca4f6f0b119a34317eb73c" FOREIGN KEY ("retentionStatusId") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" DROP CONSTRAINT "FK_10d69ca4f6f0b119a34317eb73c"`); 
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "retentionStatusId"`);
    }

}
