import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientNewColumns1718280331183 implements MigrationInterface {
  name = 'ClientNewColumns1718280331183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `ALTER TABLE "client" ADD "facebookUID" nvarchar(255)`,
    // );
    await queryRunner.query(`ALTER TABLE "client" ADD "firstSalesDeskId" int`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "fullName" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "googleUID" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "hasBrokerUser" bit`);
    await queryRunner.query(`ALTER TABLE "client" ADD "isDemo" bit`);
    await queryRunner.query(`ALTER TABLE "client" ADD "isTradingActive" bit`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "lastActionTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "originalAffiliate" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "originAlffiliateId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "orignalEmail" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "registrationIp" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "orignalSource" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "orignalTelephone" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "OrginalTelephonePrefix" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "passwordExpiryDate" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "registrationAffiliateId" int`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "clientAreaUrl" int`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "telephoneConfirmationTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isTelephoneConfirmed" bit`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "registrationtime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "usersource" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "email" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "firstname" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "lastname" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "phone" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "country" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "language" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "status" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "salesstatus" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "retention" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "affiliate" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "ninjaDesk" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "phoneGoogleVerified" bit CONSTRAINT "DF_5ec60580516e97a0f586fa39fd0" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "ftd" nvarchar(255) CONSTRAINT "DF_899da1e440c6fd2a2433028f67c" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "frd" nvarchar(255) CONSTRAINT "DF_0ee404f6cb5caa5ff5f9039db16" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "timeofftd" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "timeodfrd" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "problematic" nvarchar(255) NOT NULL CONSTRAINT "DF_59228dcf2e5d222f5593179bd6f" DEFAULT 'No'`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "lastlogin" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "kycRep" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "kycStatus" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "acquisitionStatus" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "salesoffice" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "salesmanager" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "salesresk" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "salesrep" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "retentionmanager" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "retentiondesk" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "retentionrep" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "uniqueretentionagents" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "lastsalescalltime" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "lastsalescallduration" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "lastretentioncalltime" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "lastretentioncallduration" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "lastanalystcalltime" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "lastanalystcallduration" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "lastninjaretentioncalltime" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "lastninjaretentionduration" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "dailycallduration" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totallcallamount" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totallcallduration" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "normbalance" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "normcredit" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "normfees" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "normequity" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "normmargin" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "normopenpnl" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "normclosepnl" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "normnetdeposit" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "numberofliveacc" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "numberofdemoacc" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totalswaps" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totalcommissions" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totalvolume" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totalclosedpnl" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totalcleanpnl" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totalopentrades" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totalclosedtrades" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totalopendeposits" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totalopenwithdrawals" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totaldepositamount" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totalwithdrawalamount" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "ftdsalesdesk" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "ftdsalesrep" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "ftdamount" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "frdretentionmanager" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "frdretentiondesk" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "frdretentionrep" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "frdretentionamount" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "ltdacquisitionstatus" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totalcallsbeforeftd" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totalcallsafterftd" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "totalaffectivecalls" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "lastaffectivecall" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "lastretenntionassignmentdate" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "lastTradeTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "dateOfBirth" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "firstsalesrep" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "firstsalesrepassignmentdate" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "firstRetinationRep" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "firstRetinationRepassignmentdate" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "param1" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "param2" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "param3" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "param4" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "param5" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" ADD "param6" text`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8dbf6eb21a214263c680b85b01" ON "client" ("orignalEmail") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2f8dc983382e9cfa635ccbfdfe" ON "data_upload_client" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_32b60bcf184ef38fc4cb9b05c4" ON "data_upload_client" ("firstname") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_32b60bcf184ef38fc4cb9b05c4" ON "data_upload_client"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_2f8dc983382e9cfa635ccbfdfe" ON "data_upload_client"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_8dbf6eb21a214263c680b85b01" ON "client"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "param6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "param5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "param4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "param3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "param2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "param1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "firstRetinationRepassignmentdate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "firstRetinationRep"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "firstsalesrepassignmentdate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "firstsalesrep"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "dateOfBirth"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "lastTradeTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "lastretenntionassignmentdate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "lastaffectivecall"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totalaffectivecalls"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totalcallsafterftd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totalcallsbeforeftd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "ltdacquisitionstatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "frdretentionamount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "frdretentionrep"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "frdretentiondesk"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "frdretentionmanager"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "ftdamount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "ftdsalesrep"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "ftdsalesdesk"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totalwithdrawalamount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totaldepositamount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totalopenwithdrawals"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totalopendeposits"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totalclosedtrades"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totalopentrades"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totalcleanpnl"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totalclosedpnl"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totalvolume"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totalcommissions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totalswaps"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "numberofdemoacc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "numberofliveacc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "normnetdeposit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "normclosepnl"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "normopenpnl"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "normmargin"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "normequity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "normfees"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "normcredit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "normbalance"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totallcallduration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "totallcallamount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "dailycallduration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "lastninjaretentionduration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "lastninjaretentioncalltime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "lastanalystcallduration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "lastanalystcalltime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "lastretentioncallduration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "lastretentioncalltime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "lastsalescallduration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "lastsalescalltime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "uniqueretentionagents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "retentionrep"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "retentiondesk"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "retentionmanager"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "salesrep"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "salesresk"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "salesmanager"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "salesoffice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "acquisitionStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "kycStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "kycRep"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "lastlogin"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP CONSTRAINT "DF_59228dcf2e5d222f5593179bd6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "problematic"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "timeodfrd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "timeofftd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP CONSTRAINT "DF_0ee404f6cb5caa5ff5f9039db16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "frd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP CONSTRAINT "DF_899da1e440c6fd2a2433028f67c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "ftd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP CONSTRAINT "DF_5ec60580516e97a0f586fa39fd0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "phoneGoogleVerified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "ninjaDesk"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "affiliate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "retention"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "salesstatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "language"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "country"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "phone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "lastname"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "firstname"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "email"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "usersource"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload_client" DROP COLUMN "registrationtime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isTelephoneConfirmed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "telephoneConfirmationTime"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "clientAreaUrl"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "registrationAffiliateId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "passwordExpiryDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "OrginalTelephonePrefix"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "orignalTelephone"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "orignalSource"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "registrationIp"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "orignalEmail"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "originAlffiliateId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "originalAffiliate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "lastActionTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isTradingActive"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isDemo"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "hasBrokerUser"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "googleUID"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "fullName"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "firstSalesDeskId"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "facebookUID"`);
  }
}
