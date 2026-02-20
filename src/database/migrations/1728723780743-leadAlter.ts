import { MigrationInterface, QueryRunner } from "typeorm";

export class LeadAlter1728723780743 implements MigrationInterface {
    name = 'LeadAlter1728723780743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" ADD CONSTRAINT "DF_b246003945245e9b6a4cd28df49" DEFAULT 'FSCA' FOR "regulations"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" DROP CONSTRAINT "DF_b246003945245e9b6a4cd28df49"`);
    }

}
