import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedJoinOfLeadInClient1740051370866 implements MigrationInterface {
    name = 'AddedJoinOfLeadInClient1740051370866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_1d5ebfe5661538460c3193023b9" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_1d5ebfe5661538460c3193023b9"`);
    }

}
