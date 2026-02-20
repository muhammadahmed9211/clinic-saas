/**
 * Symbols Controller
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 *
 * SECURITY ENHANCEMENT: Added JWT authentication to write endpoints
 * - POST /symbols/get-open-price - Now requires JWT token
 * - POST /symbols/update - Now requires JWT token
 */

import {
  Controller,
  Get,
  Query,
  Param,
  BadRequestException,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { SymbolsService } from './symbols.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiHeader,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ClientKafka } from '@nestjs/microservices';
import { AccountTopics } from 'src/kafka/topics/mt5/account.topics.enum';
import { PriceTopics } from 'src/mt5/price/price.topics.enum';

@ApiTags('symbols')
@Controller({
  path: 'symbols',
  version: '1',
})
export class SymbolsController {
  constructor(
    private readonly symbolsService: SymbolsService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @Inject('MT5_SERVICE_DEMO') private readonly mt5ClientDemo: ClientKafka,
  ) {}

  // ⚠️ SECURITY: JWT Authentication Required
  @Post('get-open-price')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get symbol opening prices from MT5',
    description:
      'Fetches symbols from MT5 and retrieves opening prices. Requires JWT authentication.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        symbolCode: { type: 'string', example: 'GBPSGD' },
        path: { type: 'string', example: 'forex' },
      },
      required: ['symbolCode'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Symbols updated successfully',
    schema: {
      example: {
        success: true,
        count: 150,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  async updateSymbols(@Body() body: { symbolCode: string; path?: string }) {
    const { symbolCode, path = '' } = body;
    return await this.symbolsService.getOpenPrice(symbolCode, path);
  }

  // ⚠️ SECURITY: JWT Authentication Required
  @Post('update')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update symbol opening prices from MT5',
    description:
      'Fetches symbols from MT5 and updates opening prices in database. Requires JWT authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Symbols updated successfully',
    schema: {
      example: {
        success: true,
        count: 150,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  async updateSymbolsCron() {
    return await this.symbolsService.updateSymbols();
  }

  onModuleInit() {
    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });

    Object.values(AccountTopics).forEach((topic) => {
      console.log('subscribing to topic:', `${env}.${'live'}.${topic}`);
      console.log('subscribing to topic:', `${env}.${'demo'}.${topic}`);
      this.mt5Client.subscribeToResponseOf(`${env}.${'live'}.${topic}`);
      this.mt5ClientDemo.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
    });

    Object.values(PriceTopics).forEach((topic) => {
      console.log('subscribing to topic:', `${env}.${'live'}.${topic}`);
      console.log('subscribing to topic:', `${env}.${'demo'}.${topic}`);
      this.mt5Client.subscribeToResponseOf(`${env}.${'live'}.${topic}`);
      this.mt5ClientDemo.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
    });
  }
}

@ApiTags('symbols')
@Controller({
  path: 'public/symbols',
  version: '1',
})
export class PublicSymbolsController {
  constructor(
    private readonly symbolsService: SymbolsService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @Inject('MT5_SERVICE_DEMO') private readonly mt5ClientDemo: ClientKafka,
  ) {}

  @ApiOperation({ summary: 'Find symbols by exact path' })
  @ApiParam({
    name: 'path',
    description: 'The exact path to search for (URL-encoded, e.g., "Forex")',
    example: 'Forex',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns symbols matching the provided path',
  })
  @ApiHeader({
    name: 'userId',
    required: false,
    description: 'User ID for checking favourite symbols (optional)',
  })
  @ApiHeader({
    name: 'login',
    required: false,
    description: 'MT5 Login for symbol tier filtering (optional)',
  })
  @Get('category/:path')
  async findByPath(
    @Param('path') path: string,
    @Headers('userId') userIdHeader: string,
    @Headers('login') login?: string,
  ) {
    const userId = userIdHeader ? Number(userIdHeader) : undefined;
    const res = await this.symbolsService.findByPath(path, login || '', userId);
    return ResponseWrapper.wrapDefault(res);
  }

  @ApiOperation({ summary: 'Find symbols by category' })
  @ApiQuery({
    name: 'category',
    description: 'Category in format like "forex/major" or "forex/minor"',
    required: false,
    example: 'forex/major',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns symbols matching the provided category',
  })
  @ApiHeader({
    name: 'userId',
    description: 'Optional User ID to track favourite symbols',
    required: false,
    example: '3111',
  })
  @Get('search')
  async findByCategory(
    @Query('category') category: string,
    @Headers('userId') userIdHeader: string,
  ) {
    const userId = userIdHeader ? Number(userIdHeader) : undefined;
    const res = await this.symbolsService.findByCategory(category, userId);
    return ResponseWrapper.wrapDefault(res);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Returns all categories',
  })
  @ApiResponse({
    status: 404,
    description: 'No categories found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get('categories')
  async getCategories() {
    return this.symbolsService.findAllCategories();
  }

  @ApiOperation({ summary: 'Find symbol by ID' })
  @ApiParam({
    name: 'id',
    description: 'Symbol ID',
    example: '29',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the symbol with the specified ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Symbol not found',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.symbolsService.findOne(+id);
    return ResponseWrapper.wrapDefault(res);
  }

  @ApiOperation({
    summary: 'Get All Symbols or query for favourite or top symbols',
    description:
      'Fetches all symbols. If `favourite=true` is provided, it returns only favourite symbols of the user. If `topMover=true` is provided, it returns only top moving symbols.',
  })
  @ApiQuery({
    name: 'topMovers',
    description: 'Filter to fetch only top moving symbols',
    required: false,
    example: 'true',
  })
  @ApiQuery({
    name: 'path',
    description: 'Path filter for top movers (required if topMovers=true)',
    required: false,
    example: 'Forex',
  })
  @ApiQuery({
    name: 'timeframe',
    description: 'Time filter for popular',
    required: false,
    example: '1d',
  })
  @ApiQuery({
    name: 'favourite',
    description: 'Filter to fetch only favourite symbols of the user',
    required: false,
    example: 'false',
  })
  @ApiQuery({
    name: 'popular',
    description: 'Filter to fetch only popular symbols',
    required: false,
    example: 'false',
  })
  @ApiHeader({
    name: 'userId',
    description:
      'User ID for fetching favourite symbols (Required when favourite=true)',
    required: false,
    example: '1042',
  })
  @ApiHeader({
    name: 'login',
    description: 'MT5 Login for symbol tier filtering (optional)',
    required: false,
    example: '1383668',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all symbols or favourite symbols for the user',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request when favourite=true but no userId is provided',
  })
  @ApiResponse({
    status: 404,
    description: 'No Favourite Symbols found for the user',
  })
  @Get()
  async getSymbols(
    @Query('favourite') favourite: string,
    @Query('topMovers') topMover: string,
    @Query('popular') popular: string,
    @Query('timeframe') timeframe: string,
    @Query('path') path: string,
    @Headers('userId') userIdHeader: string,
    @Headers('login') login?: string,
  ) {
    const userId = userIdHeader ? Number(userIdHeader) : undefined;
    if (favourite === 'true') {
      if (!userId) {
        throw new BadRequestException('userId is required when favourite=true');
      }
      const res = await this.symbolsService.findFavouritesByUserId(
        userId,
        login || '',
      );
      return ResponseWrapper.wrapDefault(res);
    } else if (topMover === 'true') {
      const res = await this.symbolsService.findTopMover(
        path || 'all',
        userId,
        login,
      );
      return ResponseWrapper.wrapDefault(res);
    } else if (popular == 'true') {
      const res = await this.symbolsService.findPopular(
        login,
        userId,
        timeframe,
      );
      return ResponseWrapper.wrapDefault(res);
    }
    const res = await this.symbolsService.findAll(userId, login);
    return ResponseWrapper.wrapDefault(res);
  }

  @ApiOperation({
    summary: 'Find symbols by path, top movers, or popular symbols',
  })
  @ApiParam({
    name: 'path',
    description:
      'The path to search for: category name (e.g., "Forex"), "topmovers", or "popular"',
    example: 'Forex',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns symbols based on the path type',
  })
  @Get('website/category/:path')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'topStocks', required: false, type: Boolean })
  async findByPathPublic(
    @Param('path') path: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('topStocks') topStocks?: boolean,
  ) {
    let result;
    const normalizedPath = path.toLowerCase().trim();

    if (normalizedPath === 'topmovers') {
      result = await this.symbolsService.findTopMover('all');
    } else if (normalizedPath === 'popular') {
      result = await this.symbolsService.findPopular();
    } else {
      result = await this.symbolsService.findByPathPublic(
        path,
        page,
        pageSize,
        topStocks,
      );
    }
    return ResponseWrapper.wrapDefault(result);
  }

  onModuleInit() {
    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });

    Object.values(AccountTopics).forEach((topic) => {
      console.log('subscribing to topic:', `${env}.${'live'}.${topic}`);
      console.log('subscribing to topic:', `${env}.${'demo'}.${topic}`);
      this.mt5Client.subscribeToResponseOf(`${env}.${'live'}.${topic}`);
      this.mt5ClientDemo.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
    });

    Object.values(PriceTopics).forEach((topic) => {
      console.log('subscribing to topic:', `${env}.${'live'}.${topic}`);
      console.log('subscribing to topic:', `${env}.${'demo'}.${topic}`);
      this.mt5Client.subscribeToResponseOf(`${env}.${'live'}.${topic}`);
      this.mt5ClientDemo.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
    });
  }
}
