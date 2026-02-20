import { Controller, Get, Optional, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ElasticSearchService } from './elasticSearch.service';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'aws-sdk/clients/budgets';
import { SearchQueryDto } from './search-query.dto';

@Controller({ path: 'admin/global-search', version: '1' })
@ApiTags('Global Search')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class SearchController {
  constructor(private readonly elasticSearchService: ElasticSearchService) {}


  @Get()
  @ApiOperation({ summary: 'Basic search' })
  async globalSearch(
    @Query() query : SearchQueryDto,
    @GetUser() user: User
  ) {
    const parsedIndices = query.indices 
    ? query.indices.split(',').map(index => index.trim()) 
    : undefined;
    return this.elasticSearchService.globalSearch({
      searchTerm : query.q,
      from: (query.page - 1) * query.limit,
      size: query.limit,
      indices: parsedIndices,
      sort : query.sort,
      dateFrom : query.dateFrom ,
      dateTo : query.dateTo,
    }, user);
  }

  @Get('tables') // New endpoint to get list of tables
  @ApiOperation({ summary: 'Get list of tables for Elastic Search' })
  async getTables() {
    return this.elasticSearchService.getTablesToSearch(); // Call the new service method
  }
}