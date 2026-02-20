import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientAltered1709540719614 implements MigrationInterface {
  name = 'ClientAltered1709540719614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isSHOWTRADINGCENTRAL" bit NOT NULL CONSTRAINT "DF_47c63f0204abe9b7148d7b88f1d" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isAUTOMATICWITHDRAWAL" bit NOT NULL CONSTRAINT "DF_69acb0a0e713da77aeb38cfaedf" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isAUTOMATICWITHDRAWAL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isSHOWTRADINGCENTRAL"`,
    );
  }
}
