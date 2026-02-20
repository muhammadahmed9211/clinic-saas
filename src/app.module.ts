import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { HeaderResolver } from 'nestjs-i18n';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import path from 'path';
import { ClientsModule as AdminClientModule } from 'src/admin/client/client.module';
import { ClientModule as Mt5ClientModule } from 'src/mt5/client/client.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ActiveLogModule } from './admin/active-log/active-log.module';
import { BankAccountModule } from './admin/bank-account/bank-account.module';
import { CustomDropdownModule } from './admin/custom-dropdown/custom-dropdown/custom-dropdown.module';
import { AdminKycModule } from './admin/kyc/kyc.module';
import { AuthAppleModule } from './auth-apple/auth-apple.module';
import appleConfig from './auth-apple/config/apple.config';
import { AuthFacebookModule } from './auth-facebook/auth-facebook.module';
import facebookConfig from './auth-facebook/config/facebook.config';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import googleConfig from './auth-google/config/google.config';
import { AuthTwitterModule } from './auth-twitter/auth-twitter.module';
import twitterConfig from './auth-twitter/config/twitter.config';
import { AuthModule } from './auth/auth.module';
import authConfig from './auth/config/auth.config';
import { BankAccountModule as BankAccountModuleClient } from './bank-account/bank-account.module';
import { BankDetailsModule } from './bank-details/bank-details.module';
import { BillingInformationModule } from './billing-information/billing-information.module';
import appConfig from './config/app.config';
import { AllConfigType } from './config/config.type';
import databaseConfig from './database/config/database.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { EventModule } from './events/event.module';
import fileConfig from './files/config/file.config';
import { FilesModule } from './files/files.module';
import freshdeskConfig from './fresh-desk/config/freshdesk.config';
import { FreshDeskModule } from './fresh-desk/fresh-desk.module';
import { HomeModule } from './home/home.module';
import kafkaConfig from './kafka/config/kafka.config';
import { KafkaModule } from './kafka/kafka.module';
import { QuestionModule } from './kyc/question-answer.module';
import mailConfig from './mail/config/mail.config';
import { MailModule } from './mail/mail.module';
import { MailerModule } from './mailer/mailer.module';
import { AccountModule as Mt5AccountModule } from './mt5/account/account.module';
import { PriceModule as Mt5PriceModule } from './mt5/price/price.module';
import { TradingDealModule as Mt5TradingDealModule } from './mt5/trading/deals/deal.module';
import { TradingOrderModule as Mt5TradingOrderModule } from './mt5/trading/orders/order.module';
import { TradingPositionModule as Mt5TradingPositionModule } from './mt5/trading/positions/position.module';
import { TradeRequestModule as Mt5TradeRequestModule } from './mt5/trading/trade-requests/trade-requests.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { NotificationModule } from './notification/notification.module';
import { OtpModule } from './otp/otp.module';
import { PowerBiModule } from './power-bi/power-bi.module';
import { Privilege } from './privileges/entities/privilege.entity';
import { RolePrivilege } from './privileges/entities/role-privilege.entity';
import { Role } from './roles/entities/role.entity';
import { SessionModule } from './session/session.module';
import { SettingsModule } from './settings/settings.module';
import { TableOrderModule } from './table-order/table-order.module';
import { MasterTaskModule } from './tasks/task.module';
import { TradingModule } from './trading/trading.module';
import binanceConfig from './transaction/services/binance/config/binance.config';
import bridgerpayConfig from './transaction/services/bridgerpay/config/bridgerpay.config';
import { TransactionModule } from './transaction/transaction.module';
import twilioConfig from './twilio/config/twilio.config';
import { ClientsModule } from './users/clients.module';
import { WalletModule } from './wallet/wallet.module';
// import { PrivilegeModule } from './privileges/privileges.module';
import { CallLogsModule } from './admin/call-logs/call-logs.module';
import { OperatorModule } from './admin/operator/operator.module';
import { PartnerKycModule } from './admin/partner-kyc-docs/partner-kyc-documents.module';
import { PartnerModule } from './admin/partner/partner.module';
import { TaskModule } from './admin/task/task.module';
import elasticSearchConfig from './config/elastic-search.config';
import { HeartBeatModule } from './heart-beat/heart-beat.module';
import { ListColumnsGroupModule } from './list-columns-group/list-columns-group.module';
import { ListColumnsMetaModule } from './list-columns-meta/list-columns-meta.module';
import { ListColumnsSortModule } from './list-columns-sort/list-columns-sort.module';
import { ListFilterColumnsModule } from './list-filter-columns/list-filter-columns.module';
import { ListItemModule } from './list-item/list-item.module';
import { ListViewColumnsModule } from './list-view-columns/list-view-columns.module';
import { ListViewsFilterModule } from './list-views-filter/list-views-filter.module';
import { PrivilegeMiddleware } from './middleware/privilege.middleware';
import { PermissionEndpointModule } from './permission_endpoint/permission_endpoint.module';
import redisConfig from './redis/config/redis.config';
import { RedisCoreModule } from './redis/redis.module';
import { RoleModule } from './roles/role.module';
import { TradingGroupModule } from './trading-group/trading-group.module';
import { FileUploadModule } from './upload-data/file_upload.module';
import { UserCreditCardsModule } from './user-credit-cards/user-credit-cards.module';
import { UserEWalletModule } from './user-ewallet/user-ewallet.module';
import { UserKycModule } from './user-kyc-docs/user-kyc-documents.module';
import { LeadsModule } from './admin/leads/leads.module';
import { ListCacheModule } from './list-cache/list-cache.module';
import legacyConfig from './transaction/services/legacy/config/legacy.config';
import { MeetingsModule } from './admin/leads/meetings/meeting.module';
import { OpportunityModule } from './admin/leads/opportunity/opportunity.module';
import { LeadsCallLogsModule } from './admin/leads-call-logs/leads-call-logs.module';
import { QuestionsModule } from './admin/questions/questions.module';
import nGeniusConfig from './transaction/services/n-genius/config/n-genius-config';
import dpoConfig from './transaction/services/dpo/config/dpo-config';
import { XMLParser } from './middleware/xml-parser.middleware';
import { ApplicantModule } from './admin/applicant/applicant.module';
import { JobModule } from './jobs-processor/job.module';
import { AggregatorModule } from './aggregator/aggregator.module';
import { PspModule } from './psp/psp.module';
import { DashboardModule } from './admin/dashboard/dashboard.module';
import { PermissionMiddleware } from './middleware/permission.middleware';
import { CommunicationModule } from './admin/leads/communications/communication.module';
import myFatoorahConfig from './transaction/services/my-fatoorah/config/my-fatoorah-config';
import { ExchangeModule } from './admin/exchange/exchange.module';
import praxisConfig from './transaction/services/praxis/config/praxis.config';
import alphapayConfig from './transaction/services/alphapay/config/alphapay.config';
import { RegulationsModule } from './admin/regulations/regulations.module';
// import { SocketModule } from './socket/socket.module';
import { PlugitService } from './plugit/plugit.service';
import { PlugitModule } from './plugit/plugit.module';
import { HttpModule } from '@nestjs/axios';
import plugitConfig from './plugit/config/plugit.config';
import { SearchModule } from './admin/elastic-search/elasticSearch.module';
import { RegulationsConfigModule } from './admin/regulations/regulations-config/regulations-config.module';
import { IbModule } from './ib/ib.module';
import { EmailEventModule } from './admin/email-mapping/email.module';
import { LabelModule } from './admin/labels/label.module';
import { MaskDataModule } from './roles/maskData/maskData.module';
import { ReportsModule } from './reports/reports.module';
import { IbProfileModule } from './ib/ib_profile/ib_profile.module';
import { IbConfigModule } from './ib/ib_config/ib_config.module';
import { TransferModule } from './transfer/transfer.module';
import { ListActivityLogsModule } from './list-activity-logs/list-activity-logs.module';
import { Mt5EventsModule } from './mt5/events/mt5-events.module';
import { ThreecxModule } from './threecx/threecx.module';
import { AutomationModule } from './admin/automation/automation.module';
import { NewsModule } from './news/news.module';
import { StaticDataModule } from './static-data/static-data.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/interceptors/exception.interceptor';
import jenapayConfig from './transaction/services/jenapay/config/jenapay-config';
import { EventRegistraionModule } from './event-registraion/event-registraion.module';
import { EconomicCalendarModule } from './economic-calendar/economic-calendar.module';
import { PspCountryModule } from './psp-country/psp-country.module';
import { IbAutomationModule } from './ib-automation/ib-automation.module';

import { ReferralProgramModule } from './referral-program/referral-program.module';
import { RuleModule } from './rule/rule.module';
import { ReferralRewardModule } from './referral-reward/referral-reward.module';
import { ReferralRuleModule } from './referral-rule/referral-rule.module';
import ibAutomationConfig from './ib-automation/config/ib-automation-config';
import referralConfig from './referral-program/config/referral.config';
import { BonusModule } from './bonus/bonus.module';
import { ClassificationModule } from './classification/classification.module';
import { IbMigrationModule } from './ib-migration/ib-migration.module';
import { ContactUsModule } from './contact-us/contact-us.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TwoFactorVerificationGuard } from './auth/guards/2fa-verification.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { FirebaseModule } from './firebase/firebase.module';
import firebaseConfig from './firebase/config/firebase.config';
import { InfoModule } from './mt5-manager/market/info/info.module';
import { CurrenciesModule } from './currencies/currencies.module';

// MT5 Manager Modules - Migrated by Arshad Shaheen - October 23, 2025
import { InsightsModule as MarketInsightsModule } from './mt5-manager/market/insights/insights.module';
import { InfoModule as MarketInfoModule } from './mt5-manager/market/info/info.module';
import { PriceHistoryModule } from './mt5-manager/price-history/price-history.module';
import { SymbolsModule as Mt5SymbolsModule } from './mt5-manager/symbols/symbols.module';
import priceHistoryConfig from './mt5-manager/price-history/config/price-history.config';

const imports = [
  ScheduleModule.forRoot(), // For cron jobs - Migrated by Arshad Shaheen
  ConfigModule.forRoot({
    isGlobal: true,
    load: [
      databaseConfig,
      authConfig,
      appConfig,
      mailConfig,
      fileConfig,
      facebookConfig,
      googleConfig,
      twitterConfig,
      appleConfig,
      twilioConfig,
      kafkaConfig,
      bridgerpayConfig,
      binanceConfig,
      freshdeskConfig,
      elasticSearchConfig,
      redisConfig,
      legacyConfig,
      nGeniusConfig,
      dpoConfig,
      myFatoorahConfig,
      praxisConfig,
      alphapayConfig,
      plugitConfig,
      jenapayConfig,
      ibAutomationConfig,
      referralConfig,
      priceHistoryConfig, // MT5 Manager config - Migrated by Arshad Shaheen
      firebaseConfig,
      priceHistoryConfig, // MT5 Manager config - Migrated by Arshad Shaheen
    ],
    envFilePath: ['.env'],
  }),
  ThrottlerModule.forRoot([
    {
      ttl: 60000, // 1 minute
      limit: 100, // Default high limit for non-throttled endpoints
    },
  ]),
  TypeOrmModule.forRootAsync({
    useClass: TypeOrmConfigService,
    dataSourceFactory: async (options: DataSourceOptions) => {
      return new DataSource(options).initialize();
    },
  }),
  TypeOrmModule.forFeature([Privilege, RolePrivilege, Role]),
  I18nModule.forRootAsync({
    useFactory: (configService: ConfigService<AllConfigType>) => ({
      fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
        infer: true,
      }),
      loaderOptions: {
        path: path.join(__dirname, '..', 'i18n'),
        watch: true,
      },
    }),
    resolvers: [
      {
        use: HeaderResolver,
        useFactory: (configService: ConfigService<AllConfigType>) => {
          return [
            configService.get('app.headerLanguage', {
              infer: true,
            }),
          ];
        },
        inject: [ConfigService],
      },
    ],
    imports: [ConfigModule],
    inject: [ConfigService],
  }),
  // TwilioModule.forRoot({
  //   accountSid: process.env.TWILIO_ACCOUNT_SID,
  //   authToken: process.env.TWILIO_AUTH_TOKEN,
  // }),
  // TwilioModule.forRootAsync({
  //   imports: [ConfigModule],
  //   useFactory: (configService: ConfigService) => ({
  //     accountSid: configService.get('TWILIO_ACCOUNT_SID'),
  //     authToken: configService.get('TWILIO_AUTH_TOKEN'),
  //   }),
  //   inject: [ConfigService],
  // }),
  ClientsModule,
  CommunicationModule,
  FilesModule,
  AuthModule,
  AuthFacebookModule,
  AuthGoogleModule,
  AuthTwitterModule,
  AuthAppleModule,
  SessionModule,
  MailModule,
  MailerModule,
  HomeModule,
  OtpModule,
  QuestionModule,
  AdminKycModule,
  TradingModule,
  TransactionModule,
  StaticDataModule,
  NewsletterModule,
  SettingsModule,
  UserKycModule,
  WalletModule,
  Mt5AccountModule,
  KafkaModule,
  BankAccountModule,
  BankAccountModuleClient,
  AdminClientModule,
  Mt5PriceModule,
  Mt5TradeRequestModule,
  Mt5TradingOrderModule,
  Mt5TradingDealModule,
  Mt5TradingPositionModule,
  BankDetailsModule,
  ClientsModule,
  // PrivilegeModule,
  Mt5ClientModule,
  BillingInformationModule,
  NotificationModule,
  CustomDropdownModule,
  MasterTaskModule,
  FreshDeskModule,
  TableOrderModule,
  EventModule,
  ActiveLogModule,
  PowerBiModule,
  OperatorModule,
  ListItemModule,
  ListColumnsGroupModule,
  ListColumnsMetaModule,
  RoleModule,
  ListViewsFilterModule,
  ListViewColumnsModule,
  ListFilterColumnsModule,
  ListColumnsSortModule,
  TaskModule,
  UserCreditCardsModule,
  UserEWalletModule,
  PartnerModule,
  PartnerKycModule,
  PermissionEndpointModule,
  FileUploadModule,
  CallLogsModule,
  RedisCoreModule,
  HeartBeatModule,
  TradingGroupModule,
  LeadsModule,
  MeetingsModule,
  OpportunityModule,
  LeadsCallLogsModule,
  QuestionsModule,
  ListCacheModule,
  ApplicantModule,
  JobModule,
  AggregatorModule,
  PspModule,
  DashboardModule,
  ExchangeModule,
  RegulationsModule,
  PlugitModule,
  HttpModule,
  SearchModule,
  RegulationsConfigModule,
  IbModule,
  EmailEventModule,
  LabelModule,
  MaskDataModule,
  ReportsModule,
  ListActivityLogsModule,
  Mt5EventsModule,
  ThreecxModule,
  EconomicCalendarModule,
  IbProfileModule,
  IbConfigModule,
  AutomationModule,
  NewsModule,
  EventRegistraionModule,
  PspCountryModule,
  IbAutomationModule,
  ReferralProgramModule,
  RuleModule,
  ReferralRewardModule,
  ReferralRuleModule,
  BonusModule,
  ContactUsModule,
  // MT5 Manager Modules - Migrated by Arshad Shaheen - October 23, 2025
  MarketInsightsModule,
  MarketInfoModule,
  PriceHistoryModule,
  Mt5SymbolsModule,
  ClassificationModule,
  IbMigrationModule,
  ContactUsModule,
  PushNotificationModule,
  FirebaseModule,
  InfoModule,
  CurrenciesModule,
  // MT5 Manager Modules - Migrated by Arshad Shaheen - October 23, 2025
  MarketInsightsModule,
  MarketInfoModule,
  PriceHistoryModule,
  Mt5SymbolsModule,
];

@Module({
  imports,
  providers: [
    PlugitService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TwoFactorVerificationGuard,
    },
  ],
})
export class AppModule implements NestModule {
  static async register(): Promise<typeof AppModule> {
    const TransferModuleDynamic = await TransferModule.register();
    imports.push(TransferModuleDynamic);
    @Module({
      imports,
      providers: [PlugitService],
    })
    class DynamicAppModule {}
    //@ts-ignore
    return DynamicAppModule;
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PermissionMiddleware).forRoutes('*');
    consumer
      .apply(PrivilegeMiddleware)
      // .exclude(
      //   { path: '/auth/email/login', method: RequestMethod.POST, version: '1' },
      //   {
      //     path: '/auth/email/register',
      //     method: RequestMethod.POST,
      //     version: '1',
      //   },
      //   { path: '/privileges', method: RequestMethod.ALL, version: '1' },
      //   { path: '/privileges/role', method: RequestMethod.ALL, version: '1' },
      // )
      .forRoutes('*');
    consumer.apply(XMLParser).forRoutes('*');
  }
}
