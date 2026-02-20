import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAgentFieldsToLeadsCallLog1748853076240 implements MigrationInterface {
    name = 'AddAgentFieldsToLeadsCallLog1748853076240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leads_call_log" ADD "agentExt" varchar(255)`);
        await queryRunner.query(`ALTER TABLE "leads_call_log" ADD "agentName" varchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leads_call_log" DROP COLUMN "agentName"`);
        await queryRunner.query(`ALTER TABLE "leads_call_log" DROP COLUMN "agentExt"`);
    }
}
