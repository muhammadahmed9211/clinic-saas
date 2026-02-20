export enum PlugitIbRoutes {
  CREATE_IB_CLIENT = 'AddIBClient',
  GET_IB_CLIENTS = 'GetIBClients',
  LINK_ACCOUNT_TO_IB = 'LinkAccountToIB',
  GET_POOLS_AND_COUNTRIES = 'GetPoolsAndCountries',
}

export enum PlugitIbapiVersion {
  v1 = 'v1',
}

export enum PlugitIbModule {
  IB = 'IB',
}

export function buildIbRoute(route: PlugitIbRoutes): string {
  return `${process.env.PLUG_IT_BASE_URL}/${PlugitIbModule.IB}/${PlugitIbapiVersion.v1}/${route}`;
}
