import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionMethodsRegulationsTable1730720903693 implements MigrationInterface {
    name = 'TransactionMethodsRegulationsTable1730720903693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_method_regulations" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime NOT NULL CONSTRAINT "DF_f31310b042e1532fcb73f5a108e" DEFAULT getdate(), "deletedAt" datetime2, "updatedAt" datetime NOT NULL CONSTRAINT "DF_62ede4e3d46923b3211cc53bd15" DEFAULT getdate(), "methodId" int NOT NULL, "regulationId" int NOT NULL, CONSTRAINT "PK_e74a76bebb29a01d4e74b898126" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction_method_regulations" ADD CONSTRAINT "FK_19d5cd909d91473fa350035219a" FOREIGN KEY ("methodId") REFERENCES "transaction_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_method_regulations" ADD CONSTRAINT "FK_7f2f5719a54a21f540616929d38" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_method_regulations" DROP CONSTRAINT "FK_7f2f5719a54a21f540616929d38"`);
        await queryRunner.query(`ALTER TABLE "transaction_method_regulations" DROP CONSTRAINT "FK_19d5cd909d91473fa350035219a"`);
        await queryRunner.query(`DROP TABLE "transaction_method_regulations"`);
    }

}