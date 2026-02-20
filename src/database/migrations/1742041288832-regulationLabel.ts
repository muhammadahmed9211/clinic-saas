import { MigrationInterface, QueryRunner } from "typeorm";

export class RegulationLabel1742041288832 implements MigrationInterface {
    name = 'RegulationLabel1742041288832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regulations_countries" ADD "regulationId" int`);
        await queryRunner.query(`ALTER TABLE "regulations_countries" ADD CONSTRAINT "FK_11d1a53419d418a7bc1b404688a" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulations" ADD "companyName" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "regulations" ADD "regulatedCountry" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "regulations" ADD "regulatedByLabelId" int`);
        await queryRunner.query(`ALTER TABLE "regulations" ADD CONSTRAINT "FK_5a6339492a2d6e9f84b6c828084" FOREIGN KEY ("regulatedByLabelId") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulations" ADD "licenseLabelId" int`);
        await queryRunner.query(`ALTER TABLE "regulations" ADD CONSTRAINT "FK_5e20d1dfeeea2fcfa2f06d062fd" FOREIGN KEY ("licenseLabelId") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regulations" DROP CONSTRAINT "FK_5e20d1dfeeea2fcfa2f06d062fd"`);
        await queryRunner.query(`ALTER TABLE "regulations" DROP COLUMN "licenseLabelId"`);
        await queryRunner.query(`ALTER TABLE "regulations" DROP CONSTRAINT "FK_5a6339492a2d6e9f84b6c828084"`);
        await queryRunner.query(`ALTER TABLE "regulations" DROP COLUMN "regulatedByLabelId"`);
        await queryRunner.query(`ALTER TABLE "regulations" DROP COLUMN "regulatedCountry"`);
        await queryRunner.query(`ALTER TABLE "regulations" DROP COLUMN "companyName"`);
        await queryRunner.query(`ALTER TABLE "regulations_countries" DROP CONSTRAINT "FK_11d1a53419d418a7bc1b404688a"`);
        await queryRunner.query(`ALTER TABLE "regulations_countries" DROP COLUMN "regulationId"`);
}

}
