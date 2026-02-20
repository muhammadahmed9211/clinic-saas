export type AuthConfig = {
  secret?: string;
  expires?: string;
  refreshSecret?: string;
  refreshExpires?: string;
  forgotSecret?: string;
  forgotExpires?: string;
  confirmEmailSecret?: string;
  confirmEmailExpires?: string;
  office?: number;
  salesDesk?: number;
  retentionDesk?: number;
  supportDesk?: number;
  financeDesk?: number;
  kycDesk?: number;
  source?: string;
  ImpersonateExpires?: string;
  longLivedTokenExpiry?: string;
  ticketServiceSecret?:string
};
