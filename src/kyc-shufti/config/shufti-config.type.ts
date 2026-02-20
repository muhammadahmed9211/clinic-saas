export type ShuftiConfig = {
  provider: 'shufti' | 'local';
  clientId: string;
  secretKey: string;
  baseUrl: string;
  callbackUrl: string;
  redirectUrl: string;
  awsBucket: string;
};
