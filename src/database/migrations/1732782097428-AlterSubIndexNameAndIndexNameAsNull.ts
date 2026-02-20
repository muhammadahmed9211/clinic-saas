import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterSubIndexNameAndIndexNameAsNull1732782097428 implements MigrationInterface {
    name = 'AlterSubIndexNameAndIndexNameAsNull1732782097428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE [transaction] DROP CONSTRAINT DF_eac24e72253181b647eebe11c64`);
        await queryRunner.query(`ALTER TABLE [transaction] ADD  DEFAULT '' FOR indexName`);
        await queryRunner.query(`ALTER TABLE [transaction] ALTER COLUMN indexName varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL`);

        await queryRunner.query(`ALTER TABLE [transaction] DROP CONSTRAINT DF_c1ee49fcd382373671620fea545`);
        await queryRunner.query(`ALTER TABLE [transaction] ADD  DEFAULT '' FOR subIndexName`);
        await queryRunner.query(`ALTER TABLE [transaction] ALTER COLUMN subIndexName varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "DF_c1ee49fcd382373671620fea545" DEFAULT 'SUBIDX_0' FOR "subIndexName"`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "subIndexName" varchar(255) NOT NULL`);
        
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "DF_eac24e72253181b647eebe11c64" DEFAULT 'malfex' FOR "indexName"`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "indexName" varchar(255) NOT NULL`);
    }

}
