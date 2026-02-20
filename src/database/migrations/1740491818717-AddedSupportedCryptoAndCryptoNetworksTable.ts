import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedSupportedCryptoAndCryptoNetworksTable1740491818717 implements MigrationInterface {
    name = 'AddedSupportedCryptoAndCryptoNetworksTable1740491818717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "supported_crypto" ("id" int NOT NULL IDENTITY(1,1), "coin" nvarchar(255), "url" nvarchar(MAX), "createdAt" datetime NOT NULL CONSTRAINT "DF_2c7d1c82e39a866bd85d905c4cb" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_9dc802b8c24dd73fda64fce3133" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_d00b75815558ae2bb3a46107fca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "crypto_network" ("id" int NOT NULL IDENTITY(1,1), "network" nvarchar(255) NOT NULL, "standard" nvarchar(255), "url" nvarchar(MAX), "createdAt" datetime NOT NULL CONSTRAINT "DF_55b11e76d5bf3c34ead5e47efd8" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_76281cdfa675e82b4c61670ea54" DEFAULT getdate(), "deletedAt" datetime2, "cryptoId" int NOT NULL, CONSTRAINT "PK_1a9d90517fb336d31296915bf5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "crypto_network" ADD CONSTRAINT "FK_66420cf5a025d5401f63541724d" FOREIGN KEY ("cryptoId") REFERENCES "supported_crypto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crypto_network" DROP CONSTRAINT "FK_66420cf5a025d5401f63541724d"`);
        await queryRunner.query(`DROP TABLE "crypto_network"`);
        await queryRunner.query(`DROP TABLE "supported_crypto"`);
    }

}
