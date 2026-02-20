import { Injectable } from '@nestjs/common';
import { buildIbRoute, PlugitIbRoutes } from './routes/plugit-ib.routes';
import { PlugitHttpService } from './http/plugit-http.service';

@Injectable()
export class PlugitService {
  constructor(private readonly httpService: PlugitHttpService) {}

  async createIb(
    request: CreateIbClientRequest,
  ): Promise<PlugitApiResponse<null>> {
    try {
      const createIbUrl = buildIbRoute(PlugitIbRoutes.CREATE_IB_CLIENT);
      const response: PlugitApiResponse<null> =
        await this.httpService.makeRequest('POST', createIbUrl, request);
      return response;
    } catch (error) {
      console.error('Failed to get IBs:', error.message);
      throw error.message;
    }
  }

  async getAllIbs(): Promise<PlugitApiResponse<PlugitIbClientData[]> | void> {
    try {
      const getIbUrl = buildIbRoute(PlugitIbRoutes.GET_IB_CLIENTS);
      const response: PlugitApiResponse<PlugitIbClientData[]> =
        await this.httpService.makeRequest('POST', getIbUrl);
      return response;
    } catch (error) {
      console.error('Failed to get IBs:', error.message);
    }
  }

  async linkAccountToIb(
    request: LinkAccountToIbRequest,
  ): Promise<PlugitApiResponse<null> | void> {
    try {
      const getIbUrl = buildIbRoute(PlugitIbRoutes.LINK_ACCOUNT_TO_IB);
      const response: PlugitApiResponse<null> =
        await this.httpService.makeRequest('POST', getIbUrl, request);
      return response;
    } catch (error) {
      console.error('Failed to get IBs:', error.response);
    }
  }

  async getPoolAndCountry(): Promise<PlugitApiResponse<PoolAndCountry> | void> {
    try {
      const getPoolsAndCountriesUrl = buildIbRoute(
        PlugitIbRoutes.GET_POOLS_AND_COUNTRIES,
      );
      const response: PlugitApiResponse<PoolAndCountry> =
        await this.httpService.makeRequest('POST', getPoolsAndCountriesUrl);
      return response;
    } catch (error) {
      console.error('Failed to get IBs:', error.message);
    }
  }

  async findOneIb(ibCode: string): Promise<PlugitIbClientData | void> {
    try {
      const allIbs = await this.getAllIbs();
      if (!allIbs) {
        console.log('Cannot get ibs', allIbs);
        return;
      }
      const ib = allIbs.Data.find((ib) => ib.IBCode === ibCode);
      if (ib) {
        return ib;
      }
    } catch (error) {
      console.error('Failed to get IBs:', error.message);
    }
  }
}
