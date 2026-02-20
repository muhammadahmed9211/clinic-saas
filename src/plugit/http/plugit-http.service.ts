import { HttpException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class PlugitHttpService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}
  /**
   * Generic function to make an HTTP request with predefined headers and dynamic ones
   * @param method The HTTP method (e.g., 'GET', 'POST', etc.)
   * @param url The URL of the API endpoint
   * @param body The request body (optional)
   * @param additionalHeaders Additional custom headers to include in the request
   * @returns The response data from the API
   */
  async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE', // Supported methods
    url: string,
    body: any = {}, // Default empty body for GET requests
    additionalHeaders: Record<string, string> = {}, // Accept any additional headers
  ): Promise<T> {
    // Set the default Ocp-Apim-Subscription-Key header
    const defaultHeaders = {
      'Ocp-Apim-Subscription-Key': this.configService.getOrThrow(
        'plugit.plugitSubscriptionKey',
        { infer: true },
      ),
    };
    // Merge default headers with any additional headers passed to the function
    const headers = { ...defaultHeaders, ...additionalHeaders };
    try {
      // Initialize response variable
      let response;
      // Handle different HTTP methods
      switch (method) {
        case 'POST':
          response = await firstValueFrom(
            this.httpService.post(url, body, { headers }),
          );
          break;
        case 'GET':
          response = await firstValueFrom(
            this.httpService.get(url, { headers }),
          );
          break;
        case 'PUT':
          response = await firstValueFrom(
            this.httpService.put(url, body, { headers }),
          );
          break;
        case 'DELETE':
          response = await firstValueFrom(
            this.httpService.delete(url, { headers }),
          );
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
      // Return the response data
      return response.data;
    } catch (error) {
      // Handle or rethrow error depending on the logic needed
      let message = `Request failed with message: ${
        error.message || 'Unknown error'
      }`;
      if (error.response?.data) {
        message = error.response.data;
      }
      throw new HttpException(message, error.status || 500);
    }
  }
}
