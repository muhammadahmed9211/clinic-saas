import { MigrationInterface, QueryRunner } from "typeorm";

export class DeskEntity1741252095319 implements MigrationInterface {
    name = 'DeskEntity1741252095319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "desk" DROP CONSTRAINT "FK_ff17070f6e68165d07bd9983849"`);
        await queryRunner.query(`ALTER TABLE "desk" DROP COLUMN "manager"`);
        await queryRunner.query(`ALTER TABLE "desk" ADD "managerId" bigint`);
        await queryRunner.query(`ALTER TABLE "desk" ADD "coordinatorId" bigint`);
        await queryRunner.query(`ALTER TABLE "desk" ADD CONSTRAINT "FK_13a43d4f1c8471918f0c87d0089" FOREIGN KEY ("managerId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "desk" ADD CONSTRAINT "FK_85c2f2fca45f410d375f8c92a56" FOREIGN KEY ("coordinatorId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "desk" DROP CONSTRAINT "FK_85c2f2fca45f410d375f8c92a56"`);
        await queryRunner.query(`ALTER TABLE "desk" DROP CONSTRAINT "FK_13a43d4f1c8471918f0c87d0089"`);
        await queryRunner.query(`ALTER TABLE "desk" ADD CONSTRAINT "FK_ff17070f6e68165d07bd9983849" FOREIGN KEY ("manager") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        }

}
