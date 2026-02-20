import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientAltered1713792408633 implements MigrationInterface {
  name = 'ClientAltered1713792408633';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" ADD "server" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "userSource" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "localTimeApprox" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "phoneSuspicious" bit CONSTRAINT "DF_ea7a10bbf3a2d9ac2f64945371e" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "phoneGoogleVerified" bit CONSTRAINT "DF_a02a34fa8e5be217b6b968c58d6" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "loggedIn" bit CONSTRAINT "DF_6f4801a0ce71d4725776edb89e4" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "loggedInMetaTraders" bit CONSTRAINT "DF_1014a48cd2387b522a7cc89311b" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "loggedInPremiumMobile" bit CONSTRAINT "DF_0be3de017a6bb6b28d579a74035" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "loggedInPremiumWebtrader" bit CONSTRAINT "DF_31b588cc347e33df65a7e73d863" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "salesLastAssigned" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "retentionLastAssigned" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "kycRep" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "client" ADD "kycScore" int`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "acquisitionStatus" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "marketingType" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "previouslyNI" bit CONSTRAINT "DF_aa825f359f631137e02c4dee9d7" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "fnsStatus" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "accountClassification" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "salesDesk" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "ninjaDesk" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "timesOfFTD" datetime`);
    await queryRunner.query(`ALTER TABLE "client" ADD "timesOfLTD" datetime`);
    await queryRunner.query(`ALTER TABLE "client" ADD "depositCount" int`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "daysWithoutDeposit" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "registrationTime" datetime`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "modifiedTime" datetime`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "lastRetentionAssignmentDate" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "lastTimeLogin" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "lastCommunicationTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "emailBounced" bit CONSTRAINT "DF_45c4a2ca354c7a5f2c3774d5dd3" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "FTD" bit CONSTRAINT "DF_7d9bba211a06cf27caa1b11ee77" DEFAULT 0`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "SYSTEM" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "client" ADD "NORMBALANCE" int`);
    await queryRunner.query(`ALTER TABLE "client" ADD "NORMCREDIT" int`);
    await queryRunner.query(`ALTER TABLE "client" ADD "NORMFEES" int`);
    await queryRunner.query(`ALTER TABLE "client" ADD "NORMEQUITY" int`);
    await queryRunner.query(`ALTER TABLE "client" ADD "NORMMARGIN" int`);
    await queryRunner.query(`ALTER TABLE "client" ADD "NORMOPENPNL" int`);
    await queryRunner.query(`ALTER TABLE "client" ADD "NORMCLOSEPNL" int`);
    await queryRunner.query(`ALTER TABLE "client" ADD "NORMNETDEPOSIT" int`);
    await queryRunner.query(`ALTER TABLE "client" ADD "numberOfLiveAcc" int`);
    await queryRunner.query(`ALTER TABLE "client" ADD "tickets" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "PRO" bit CONSTRAINT "DF_eaf27400e287da03ae1583ee8c2" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "accountType" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "extendCallHours" bit CONSTRAINT "DF_5c1ce63320a35fac539835b3e97" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "extendCallHoursDecisionTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "tradingStyle" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "kycClientType" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "tradingAccExternalIds" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "referrerType" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "auditGrading" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "pendingGrading" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "tone" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "approach" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "uspsProperlyMentioned" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "futureTaskScheduled" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "auditorName" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "auditTime" datetime`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "idVerificationStatus" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "porVerificationStatus" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "accountStatus" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "actions" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "salesRep" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "salesStatus" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "retentionStatus" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "retentionStatus"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "salesStatus"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "salesRep"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "actions"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "accountStatus"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "porVerificationStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "idVerificationStatus"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "auditTime"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "auditorName"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "futureTaskScheduled"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "uspsProperlyMentioned"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "approach"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "tone"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "pendingGrading"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "auditGrading"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "referrerType"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "tradingAccExternalIds"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "kycClientType"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "tradingStyle"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "extendCallHoursDecisionTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_5c1ce63320a35fac539835b3e97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "extendCallHours"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "accountType"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_eaf27400e287da03ae1583ee8c2"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "PRO"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "tickets"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "numberOfLiveAcc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "NORMNETDEPOSIT"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "NORMCLOSEPNL"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "NORMOPENPNL"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "NORMMARGIN"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "NORMEQUITY"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "NORMFEES"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "NORMCREDIT"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "NORMBALANCE"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "SYSTEM"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_7d9bba211a06cf27caa1b11ee77"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "FTD"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_45c4a2ca354c7a5f2c3774d5dd3"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "emailBounced"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "lastCommunicationTime"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "lastTimeLogin"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "lastRetentionAssignmentDate"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "modifiedTime"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "registrationTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "daysWithoutDeposit"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "depositCount"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "timesOfLTD"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "timesOfFTD"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "ninjaDesk"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "salesDesk"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "accountClassification"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "fnsStatus"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_aa825f359f631137e02c4dee9d7"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "previouslyNI"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "marketingType"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "acquisitionStatus"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "kycScore"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "kycRep"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "retentionLastAssigned"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "salesLastAssigned"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_31b588cc347e33df65a7e73d863"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "loggedInPremiumWebtrader"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_0be3de017a6bb6b28d579a74035"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "loggedInPremiumMobile"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_1014a48cd2387b522a7cc89311b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "loggedInMetaTraders"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_6f4801a0ce71d4725776edb89e4"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "loggedIn"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_a02a34fa8e5be217b6b968c58d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "phoneGoogleVerified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_ea7a10bbf3a2d9ac2f64945371e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "phoneSuspicious"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "localTimeApprox"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "userSource"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "server"`);
  }
}
