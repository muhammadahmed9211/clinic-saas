import { MigrationInterface, QueryRunner } from 'typeorm';

export class MT5TableAddedGeneratedPrimaryKey1710399580609
  implements MigrationInterface
{
  name = 'MT5TableAddedGeneratedPrimaryKey1710399580609';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD "id" int NOT NULL IDENTITY(1,1)`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" DROP CONSTRAINT "PK_d81c82afe892f63f31893a0a2bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD CONSTRAINT "PK_d08b290207e174e84963641fb7a" PRIMARY KEY ("login", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" DROP CONSTRAINT "PK_d08b290207e174e84963641fb7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD CONSTRAINT "PK_f4425e1afde38abbd35ac7dd760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD CONSTRAINT "UQ_d81c82afe892f63f31893a0a2bf" UNIQUE ("login")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mt5_account" DROP CONSTRAINT "UQ_d81c82afe892f63f31893a0a2bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" DROP CONSTRAINT "PK_f4425e1afde38abbd35ac7dd760"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD CONSTRAINT "PK_d08b290207e174e84963641fb7a" PRIMARY KEY ("login", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" DROP CONSTRAINT "PK_d08b290207e174e84963641fb7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD CONSTRAINT "PK_d81c82afe892f63f31893a0a2bf" PRIMARY KEY ("login")`,
    );
    await queryRunner.query(`ALTER TABLE "mt5_account" DROP COLUMN "id"`);
  }
}
