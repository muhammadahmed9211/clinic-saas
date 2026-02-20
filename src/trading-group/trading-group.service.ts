import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTradingGroupDto } from './dto/create-trading-group.dto';
import { UpdateTradingGroupDto } from './dto/update-trading-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TradingGroup, TradingGroupType } from './entities/trading-group.entity';
import { Repository } from 'typeorm';
import { Server, ServerName } from 'src/wallet/entities/server.entity';

@Injectable()
export class TradingGroupService {
  constructor(
    @InjectRepository(TradingGroup)
    private readonly tradingGroupRepository: Repository<TradingGroup>,
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>,
  ) { }
  async create(createTradingGroupDto: CreateTradingGroupDto) {
    try {
      const server = await this.serverRepository.findOneBy({
        name: createTradingGroupDto.serverName,
      });
      if (!server) throw new NotFoundException('Server not found');
      return this.tradingGroupRepository.save(
        this.tradingGroupRepository.create({
          name: createTradingGroupDto.name,
          server,
        }),
      );
    } catch (error) {
      console.log('Error creating trading group:', error);
      throw new InternalServerErrorException('Error creating trading group');
    }
  }

  async getDemoTradingGroup() {
    const server = await this.serverRepository.findOneBy({
      name: ServerName.DEMO,
    });
    if (!server) {
      throw new BadRequestException("MT5 Demo Server not found")
    };
    const group = await this.tradingGroupRepository.findOne({
      where: {
        type: TradingGroupType.NORMAL,
        server: {
          id: server.id
        }
      }
    });
    if (!group) {
      throw new BadRequestException("MT5 Demo Trading Group not found")
    };
    return group
  }

  async findAll(dto: { classificationId?: number, type?: string }) {
    try {
      const server = await this.serverRepository.findOneBy({
        name: ServerName.LIVE,
      });
      if (!server) {
        throw new BadRequestException("MT5 Live Server not found")
      };
      return this.tradingGroupRepository.find({
        where: {
          classificationId: dto.classificationId ? dto.classificationId : undefined,
          type: dto.type ? dto.type : undefined,
          server: {
            id: server.id
          }
        }
      });
    } catch (error) {
      console.log('Error fetching trading groups:', error);
      throw new InternalServerErrorException('Error fetching trading groups');
    }
  }

  findOne(id: number) {
    try {
      return this.tradingGroupRepository.findOneBy({ id });
    } catch (error) {
      console.log('Error fetching trading group:', error);
      throw new InternalServerErrorException('Error fetching trading group');
    }
  }

  findOneByName(name: string) {
    try {
      return this.tradingGroupRepository.findOneBy({ name });
    } catch (error) {
      console.log('Error fetching trading group:', error);
      throw new InternalServerErrorException('Error fetching trading group');
    }
  }

  findOneByServerName(name: ServerName) {
    try {
      return this.tradingGroupRepository.findOneBy({ server: { name } });
    } catch (error) {
      console.log('Error fetching trading group:', error);
      throw new InternalServerErrorException('Error fetching trading group');
    }
  }

  async update(id: number, updateTradingGroupDto: UpdateTradingGroupDto) {
    try {
      const tradingGroup = await this.tradingGroupRepository.findOneBy({ id });
      if (!tradingGroup) throw new NotFoundException('Trading group not found');

      const server = await this.serverRepository.findOneBy({
        name: updateTradingGroupDto.serverName,
      });
      if (!server) throw new NotFoundException('Server not found');

      return this.tradingGroupRepository.save(
        this.tradingGroupRepository.create({
          ...tradingGroup,
          name: updateTradingGroupDto.name,
          server,
        }),
      );
    } catch (error) {
      console.log('Error updating trading group:', error);
      throw new InternalServerErrorException('Error updating trading group');
    }
  }

  remove(id: number) {
    try {
      return this.tradingGroupRepository.delete({ id });
    } catch (error) {
      console.log('Error deleting trading group:', error);
      throw new InternalServerErrorException('Error deleting trading group');
    }
  }
}
