import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedByLead1739802798623 implements MigrationInterface {
    name = 'CreatedByLead1739802798623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "lead" ADD "createdByOperatorId" bigint`);
        await queryRunner.query(`ALTER TABLE "lead" ADD CONSTRAINT "FK_8fa7bc225351c66c78738f55209" FOREIGN KEY ("createdByOperatorId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" DROP CONSTRAINT "FK_8fa7bc225351c66c78738f55209"`);
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "createdByOperatorId"`);
    }

}
