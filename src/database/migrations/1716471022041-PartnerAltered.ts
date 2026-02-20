import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerAltered1716471022041 implements MigrationInterface {
  name = 'PartnerAltered1716471022041';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "rateLimiting"`);
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "reqPerInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "salesStatusesReqPerInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getWithdrawalsReqPerInterval"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "trackVisitRL" bit`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "trackReqPerInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "userReqPerInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "leadReqPerInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getUser" bit CONSTRAINT "DF_88f6ad38987c032f53d0ad34489" DEFAULT 0`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "getUserRL" bit`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "salesReqPerInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "depositReqPerInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "withdrawalsReqPerInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_966abb915507320b70ab56d1357" DEFAULT 0 FOR "trackVisit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_9f22cf61be0fa3061c0dad0e699" DEFAULT 0 FOR "registerUser"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_6d5728201c1183cf7f2245bbd5f" DEFAULT 0 FOR "registerLead"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_2c345d394f5aa7d7b8895619e08" DEFAULT 0 FOR "registerLeadRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_f813d70a667ca902a0b6b217d8d" DEFAULT 0 FOR "getUsers"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_e7df9548eeded89c1870469e394" DEFAULT 0 FOR "getDeposits"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_c64b8480e4b36b39611d67481f4" DEFAULT 0 FOR "getStats"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_19d4816838eaba881db4d83b2e5" DEFAULT 0 FOR "getSalesStatuses"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_9a9f48f15d6d0aecda96f393510" DEFAULT 0 FOR "getSalesStatusesRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_bbf566fd78c00385bb8a4c9cd4f" DEFAULT 0 FOR "getDeposit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_2fdc4a981f1246e8513f8638a02" DEFAULT 0 FOR "syncUserTransactionRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_bcb783b39d186a3963cf5bb79eb" DEFAULT 0 FOR "syncUserNoteRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_68f6469713b4c14e9e05926bf1c" DEFAULT 0 FOR "regenerateUserAutologinUrlRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_0e7f5396e5c6e489d25727bb5a1" DEFAULT 0 FOR "getUserClosedTradesRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_b53e3fb3799d0f60858c7f7aa46" DEFAULT 0 FOR "getWithdrawalRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_4af3f4f7e57fd04665e912c6c32" DEFAULT 0 FOR "getWithdrawalsRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_d065f1a6eaa92e234f5447144b4" DEFAULT 0 FOR "createAffiliateRL"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_d065f1a6eaa92e234f5447144b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_4af3f4f7e57fd04665e912c6c32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_b53e3fb3799d0f60858c7f7aa46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_0e7f5396e5c6e489d25727bb5a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_68f6469713b4c14e9e05926bf1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_bcb783b39d186a3963cf5bb79eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_2fdc4a981f1246e8513f8638a02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_bbf566fd78c00385bb8a4c9cd4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_9a9f48f15d6d0aecda96f393510"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_19d4816838eaba881db4d83b2e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_c64b8480e4b36b39611d67481f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_e7df9548eeded89c1870469e394"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_f813d70a667ca902a0b6b217d8d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_2c345d394f5aa7d7b8895619e08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_6d5728201c1183cf7f2245bbd5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_9f22cf61be0fa3061c0dad0e699"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_966abb915507320b70ab56d1357"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "withdrawalsReqPerInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "depositReqPerInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "salesReqPerInterval"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "getUserRL"`);
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_88f6ad38987c032f53d0ad34489"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "getUser"`);
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "leadReqPerInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "userReqPerInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "trackReqPerInterval"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "trackVisitRL"`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getWithdrawalsReqPerInterval" bit`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "salesStatusesReqPerInterval" bit`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "reqPerInterval" bit`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "rateLimiting" bit`);
  }
}
