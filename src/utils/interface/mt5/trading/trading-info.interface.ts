import { Classification } from "src/classification/entities/classification.entity";
import { IbCommissionProfile } from "src/ib/ib_profile/entities/ib_commission_profile.entity";

export class ITradingInfo {
  id: string;
  tradingGroup: string;
  fixedCurrencyRatio: string;
  accountAgent: string;
  commentFromTradingPlatform: string;
  server: string;
  accountGroupType: string;
  ibLink: string;
  platform: string;
  leverage: string;
  walletId: string;
  creationTime: string;
  externalId: string;
  accountTier: string;
  updateTime: string;
  name: string;
  email: string;
  commissionProfile?: IbCommissionProfile;
  tradingGroupDescription: string;
  classification?: Classification;
}
