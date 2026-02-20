// Define the structure for the overall API response
interface PlugitApiResponse<T = null> {
  Message: string;
  Data: T extends null ? null : T; // If T is null, Data is null; otherwise, it's an array of T
}

interface CreateIbClientRequest {
  FirstName: string;
  LastName: string;
  CountryID: number;
  PhoneNumber: string;
  Email: string;
  PoolID: number;
  IBCode: string;
  MasterClientID: string;
}

// Define the structure for individual client data
interface PlugitIbClientData {
  FullName: string;
  WalletID: string;
  ClientID: string;
  ClientRangeID: string;
  IBCode: string;
}

interface LinkAccountToIbRequest {
  ServerName: string;
  ServerType: string;
  Login: string;
  IBCode: string;
}

interface Pool {
  PoolID: number;
  PoolName: string;
}

interface Country {
  CountryID: number;
  CountryCode: string;
  CountryName: string;
  CountryPhone: string;
  PoolID: number;
}

interface PoolAndCountry {
  Pools: Pool[];
  Countries: Country[];
}
