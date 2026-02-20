import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIbConfiguration21745579573845 implements MigrationInterface {
    name = 'CreateIbConfiguration21745579573845'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "ib_commission_profile_config" DROP CONSTRAINT "UQ_62d98bbe245c3398ec65e7709e7"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "ib_commission_profile_config" ADD CONSTRAINT "UQ_62d98bbe245c3398ec65e7709e7" UNIQUE ("priority")`);
    }

}
