import { BadRequestException, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { FormattedHit, SearchHit, SearchResponse } from './searchTypes';
import { RoleService } from 'src/roles/role.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { LevelEnum } from 'src/roles/filter_level.enum';
import { RedisCoreService } from 'src/redis/redis.service';


interface OperatorData {
  operator: {
    id: number;
    role: {
      id: number;
    };
  };
}
@Injectable()
export class ElasticSearchService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly redis: RedisCoreService,
    private readonly roleService?: RoleService,
  ) {}

  private getOperatorKey(userId: number) {
    return `OPERATOR:${userId}`;
  }

  private getRoleFilterDataKey(roleId: number) {
    return `ROLE_FILTER:${roleId}`;
  }

 
  async globalSearch(
    params: {
      searchTerm?: string;
      from?: number;
      size?: number;
      indices?: string[];
      sort?: string;
      dateFrom?: string;
      dateTo?: string;
    },
    currentUserId?: any,
  ) {
    const {
      searchTerm = '',
      from = 0,
      size = 10,
      indices,
      sort = 'relevance',
      dateFrom,
      dateTo,
    } = params;
    try {
      const operatorKey = this.getOperatorKey(currentUserId?.id);
      let operator = await this.redis.get({ key: operatorKey });
      
      if (!operator) {
        operator = await this.userRepository.findOne({
          where: { id: currentUserId?.id },
          relations: { operator: { role: true, operator_rel: true } },
        });
        
        if (operator) {
          await this.redis.set({ 
            key: operatorKey, 
            value: JSON.stringify(operator) 
          });
        }
      } else {
        operator = JSON.parse(operator as string) as OperatorData;
      }

      const roleId = (operator as OperatorData)?.operator?.role?.id;
      if (!roleId) {
        throw new BadRequestException('Role not found');
      }

      // Get roleFilterData from Redis or service
      const roleFilterKey = this.getRoleFilterDataKey(roleId);
      let roleFilterData = await this.redis.get({ key: roleFilterKey });

      if (!roleFilterData) {
        roleFilterData = await this.roleService?.roleFilterData(roleId as number);
        
        if (roleFilterData) {
          await this.redis.set({ 
            key: roleFilterKey, 
            value: JSON.stringify(roleFilterData) 
          });
        }
      } else {
        roleFilterData = JSON.parse(roleFilterData as string);
      }
      let baseQuery: any[] = [];

      Object.entries(roleFilterData ?? {}).forEach(
        ([filterName, filterData]) => {
          const { ids, condition } = filterData as FilterData;

          if (filterName === 'level') {
            const levelNames = ids.map(
              (id) => LevelEnum.find((level) => level.id === id)?.name,
            );

            if (levelNames.includes('self')) {
              const selfKeys = [
                'salesrepid',
                'retentionrepid',
                'financerepid',
                'kycrepid',
                'supportrepid',
              ];
              const selfQueries = selfKeys.map((key) => ({
                term: { [key]: (operator as { operator: { id: number } }).operator.id },
              }));
              baseQuery = [{ bool: { should: selfQueries } }];
            }

            if (levelNames.includes('team')) {
              const teamKeys = [
                'salesrepid',
                'retentionrepid',
                'financerepid',
                'kycrepid',
                'supportrepid',
                'salesmanagerid',
                'supportmanagerid',
                'kycmanagerid',
                'financemanagerid',
                'retentionmanagerid',
              ];
              const teamQueries = teamKeys.map((key) => ({
                term: { [key]: (operator as { operator: { id: number } }).operator.id },
              }));
              if (baseQuery.length) {
                baseQuery[0].bool.should.push(...teamQueries);
              } else {
                baseQuery = [{ bool: { should: teamQueries } }];
              }
            }
          } else if (filterName === 'office') {
            const officeKeys = ['officeid'];
            const officeQueries = officeKeys.map((key) => ({
              terms: { [key]: ids },
            }));

            if (condition === 'OR') {
              if (baseQuery.length) {
                // Check if we're dealing with an AND structure
                if (baseQuery[0].bool.must) {
                  baseQuery = [
                    {
                      bool: {
                        must: [
                          baseQuery[0], // Keep existing AND conditions
                          { bool: { should: officeQueries } }, // Add new OR conditions
                        ],
                      },
                    },
                  ];
                } else if (baseQuery[0].bool.should) {
                  // If we have a should array, add to it directly
                  baseQuery[0].bool.should.push(...officeQueries);
                }
              } else {
                baseQuery = [{ bool: { should: officeQueries } }];
              }
            } else if (condition === 'AND') {
              if (baseQuery.length) {
                // Convert the existing query to an AND structure if it isn't already
                if (!baseQuery[0].bool.must) {
                  const existingConditions = baseQuery[0].bool.should || [];
                  baseQuery = [
                    {
                      bool: {
                        must: [
                          { bool: { should: existingConditions } },
                          { bool: { should: officeQueries } },
                        ],
                      },
                    },
                  ];
                } else {
                  baseQuery[0].bool.must.push({
                    bool: { should: officeQueries },
                  });
                }
              } else {
                baseQuery = [{ bool: { should: officeQueries } }];
              }
            }
          } else if (filterName === 'desk') {
            const deskKeys = [
              'salesdeskid',
              'retentiondeskid',
              'financedeskid',
              'kycdeskid',
              'supportdeskid',
            ];

            const deskQueries = deskKeys.map((key) => ({
              terms: { [key]: ids },
            }));

            if (condition === 'OR') {
              if (baseQuery.length) {
                // Check if we're dealing with an AND structure
                if (baseQuery[0].bool.must) {
                  baseQuery = [
                    {
                      bool: {
                        must: [
                          baseQuery[0], // Keep existing AND conditions
                          { bool: { should: deskQueries } }, // Add new OR conditions
                        ],
                      },
                    },
                  ];
                } else if (baseQuery[0].bool.should) {
                  // If we have a should array, add to it directly
                  baseQuery[0].bool.should.push(...deskQueries);
                }
              } else {
                baseQuery = [{ bool: { should: deskQueries } }];
              }
            } else if (condition === 'AND') {
              if (baseQuery.length) {
                // Convert the existing query to an AND structure if it isn't already
                if (!baseQuery[0].bool.must) {
                  const existingConditions = baseQuery[0].bool.should || [];
                  baseQuery = [
                    {
                      bool: {
                        must: [
                          { bool: { should: existingConditions } },
                          { bool: { should: deskQueries } },
                        ],
                      },
                    },
                  ];
                } else {
                  baseQuery[0].bool.must.push({
                    bool: { should: deskQueries },
                  });
                }
              } else {
                baseQuery = [{ bool: { should: deskQueries } }];
              }
            }
          }
          return baseQuery;
        },
      );

      const indicesToSearch =
        indices && indices.length > 0
          ? indices
          : [
              `leads_${process.env.ENVIRONMENT}`,
              `clients_${process.env.ENVIRONMENT}`,
              `transactions_${process.env.ENVIRONMENT}`,
              `notes_${process.env.ENVIRONMENT}`,
              `meetings_${process.env.ENVIRONMENT}`,
              `leads_call_log_${process.env.ENVIRONMENT}`,
            ];

      let sortConfig: any[] = [{ _score: 'desc' }];
      switch (sort) {
        case 'newest':
          sortConfig.unshift({
            createdat: {
              order: 'desc',
              unmapped_type: 'date',
            },
          });
          break;
        case 'oldest':
          sortConfig.unshift({
            createdat: {
              order: 'asc',
              unmapped_type: 'date',
            },
          });
          break;
      }

      const dateRangeQuery: any[] = [];
      
      if (dateFrom || dateTo) {
        const rangeQuery: any = { createdat: {} };
        
        if (dateFrom) {
          rangeQuery.createdat.gte = new Date(dateFrom).toISOString();
        }
        
        if (dateTo) {
          rangeQuery.createdat.lte = new Date(dateTo).toISOString();
        }
        
        dateRangeQuery.push({ range: rangeQuery });
      }
      const searchQuery = {
        index: indicesToSearch,
        _source: [
          'id',
          'userid',
          'firstname',
          'lastname',
          'email',
          'createdat',
          'amount',
          'type',
          'title',
          'note',
          'status',
          'subject',
          'calltousername',
          'callagenda'
        ],
        // fields: ['_index', '_id'],
        body: {
          script_fields: {
            redirect_link: {
              script: {
                lang: 'painless',
                source: `
                  String index = doc._index.value;
                  if (index.contains('leads_call_log')) {
                    return '/call-logs/' + params._source.id;
                  }
                  else if (index.contains('leads')) {
                    return '/leads/' + params._source.id;
                  } else if (index.contains('transactions')) {
                    return '/clients/' + params._source.userid + '?fid=' + params._source.id;
                  }
                  else if (index.contains('meetings')) {
                    return '/meetings/' + params._source.id;
                  }
                  else if (index.contains('notes')) {
                    return '/notes/' + params._source.id;
                  }
                  else if (index.contains('clients')) {
                    return '/clients/' + params._source.id;
                  }
                  return '';
                `,
              },
            },
            index_name: {
              script: {
                lang: 'painless',
                source: `
                  String index = doc._index.value;
                  if (index.contains('leads_call_log')) return 'Call Logs';
                  if (index.contains('leads')) return 'Leads';
                  if (index.contains('transactions')) return 'Transactions';
                  if (index.contains('meetings')) return 'Meetings';
                  if (index.contains('notes')) return 'Notes';
                  if (index.contains('clients')) return 'Clients';
                  return index;
                `
              }
            }
          },
          query: {
            bool: {
              must: [
                // { term: { isactive: true } },
                { exists: { field: 'salesrepid' } },
                ...(baseQuery.length > 0 ? baseQuery : []),
                ...(dateRangeQuery.length > 0 ? dateRangeQuery : []),
                {
                  bool: {
                    should: [
                      {
                        wildcard: {
                          amount: {
                            value: `*${searchTerm}*`, // Match "50" as "50*" to catch "50.0"
                          },
                        },
                      },
                      {
                        wildcard: {
                          'email.keyword': {
                            value: `*${searchTerm}*`,
                            boost: 2,
                            case_insensitive: true,
                          },
                        },
                      },
                      {
                        wildcard: {
                          firstname: {
                            value: `${searchTerm}*`,
                            boost: 2,
                          },
                        },
                      },
                      {
                        wildcard: {
                          lastname: {
                            value: `${searchTerm}*`,
                            boost: 2,
                          },
                        },
                      },
                      // {
                      //   wildcard: {
                      //     userid: {
                      //       value: `${searchTerm}*`,
                      //       boost: 2,
                      //     },
                      //   },
                      // },
                      {
                        wildcard: {
                          'id.keyword': {
                            value: `*${searchTerm}*`,
                            case_insensitive: true,
                            boost: 2,
                          },
                        },
                      },
                      {
                        wildcard: {
                          note: {
                            value: `*${searchTerm}*`,
                            case_insensitive: true,
                            boost: 2,
                          },
                        },
                      },
                      {
                        wildcard: {
                          title: {
                            value: `*${searchTerm}*`,
                            case_insensitive: true,
                            boost: 2,
                          },
                        },
                      },
                      {
                        wildcard: {
                          calltousername: {
                            value: `*${searchTerm}*`,
                            case_insensitive: true,
                            boost: 2,
                          },
                        },
                      },
                      {
                        wildcard: {
                          subject: {
                            value: `*${searchTerm}*`,
                            case_insensitive: true,
                            boost: 2,
                          },
                        },
                      },
                      {
                        wildcard: {
                          title: {
                            value: `*${searchTerm}*`,
                            case_insensitive: true,
                            boost: 2,
                          },
                        },
                      },
                      {
                        wildcard: {
                          callagenda: {
                            value: `*${searchTerm}*`,
                            case_insensitive: true,
                            boost: 2,
                          },
                        },
                      },
                      // {
                      //   range: {
                      //     amount: {
                      //       gte: isNaN(parseFloat(searchTerm)) ? null : parseFloat(searchTerm),
                      //       lte: isNaN(parseFloat(searchTerm)) ? null : parseFloat(searchTerm),
                      //       boost: 2
                      //     }
                      //   }
                      // }
                    ],
                    // minimum_should_match: 1,
                  },
                },
              ],
            },
          },
          fields: ['redirect_link' , 'index_name'],
          from,
          size,
          highlight: {
            pre_tags: ['<strong>'],
            post_tags: ['</strong>'],
            fields: {
              firstname: { number_of_fragments: 0 },
              lastname: { number_of_fragments: 0 },
              'email.keyword': { number_of_fragments: 0 },
              userid: { number_of_fragments: 0 },
              status: { number_of_fragments: 0 },
              amount: { number_of_fragments: 0 },
              'id.keyword': { number_of_fragments: 0 },
              note: { number_of_fragments: 0 },
              title: { number_of_fragments: 0 },
              subject: { number_of_fragments: 0 },
              callagenda: { number_of_fragments: 0 },
              calltousername: { number_of_fragments: 0 },
            },
          },
          sort: sortConfig,
        },
      };
      const response =
        await this.elasticsearchService.search<SearchResponse>(searchQuery);
      // const hits = response?.hits?.hits.map((hit: SearchHit): FormattedHit => {
      //   const index = hit._index.split('_')[0];
      //   const _source = hit._source;
      //   let redirect_link = '';
      //   if (index.startsWith('leads')) {
      //     redirect_link = `/leads/${hit._id}`;
      //   } else if (index.startsWith('transactions')) {
      //     redirect_link = `/clients/${hit._source.userid}?fid=${hit._id}`;
      //   }

      //   return {
      //     _source,
      //     id: hit._id,
      //     _index: index,
      //     redirect_link,
      //     highlight: hit.highlight,
      //   };
      // });

      return {
        hits: response?.hits?.hits,
        total: response?.hits?.total,
        took: response?.took,
      };
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  async getTablesToSearch() {
    // Updated method to retrieve tables with name and value
    try {
      const tables = [
        { name: 'Leads', value: `leads_${process.env.ENVIRONMENT}` },
        { name: 'Clients', value: `clients_${process.env.ENVIRONMENT}` },
        {
          name: 'Transactions',
          value: `transactions_${process.env.ENVIRONMENT}`,
        },
        {
          name: 'Meetings',
          value: `meetings_${process.env.ENVIRONMENT}`,
        },
        {
          name: 'Notes',
          value: `notes_${process.env.ENVIRONMENT}`,
        },
        {
          name: 'Call Logs',
          value: `leads_call_log_${process.env.ENVIRONMENT}`,
        },
      ];
      return tables;
    } catch (error) {
      throw new Error(`Failed to retrieve tables`);
    }
  }
}
