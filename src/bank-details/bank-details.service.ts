import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank-detail.dto';
import { User } from 'src/users/entities/user.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { BankDetailRepository } from './repositories/bank-detail.repository';
import { BankDetail } from './entities/bank-detail.entity';
import { FindOptionsWhere } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';

@Injectable()
export class BankDetailsService {
  constructor(
    private readonly bankDetailsRepository: BankDetailRepository,
    private readonly filesService: FilesService,
  ) {}
  async create(
    createBankDetailDto: CreateBankDetailDto,
    userId: User['id'],
    isAdmin = false,
  ) {
    if (!createBankDetailDto?.statement?.id && !isAdmin) {
      throw new UnprocessableEntityException('Statement file id is required');
    }
    const isExist = await this.bankDetailsRepository.findOne({
      where: {
        name: createBankDetailDto.name,
        iban: createBankDetailDto.iban,
        user: { id: userId },
      },
    });
    if (isExist) {
      throw new UnprocessableEntityException('Bank detail already exists');
    }
    const user = new User();
    user.id = userId;

    let statement;
    if (createBankDetailDto?.statement?.id) {
      await this.filesService.isExist(createBankDetailDto?.statement?.id);
      statement = new FileEntity();
      statement.id = createBankDetailDto.statement.id;
    }

    const entity = await this.bankDetailsRepository.insertOne({
      ...createBankDetailDto,
      user,
      statement,
    });
    return entity;
  }

  async findAll(userId: number, query: PaginationDto) {
    const entities = await this.bankDetailsRepository.findWithPagination(
      {
        where: { user: { id: userId } },
      },
      query,
    );
    return entities;
  }

  async findOne(userId: number, id: number) {
    const bankDetails = await this.bankDetailsRepository.findOne({
      where: { id, user: { id: userId } },
    });
    const entity:
      | (BankDetail & { statement: FileEntity & { url?: string } })
      | null = bankDetails;
    if (!entity) {
      throw new NotFoundException('Bank details not found');
    }
    if (entity?.statement?.id) {
      const url: string = await this.filesService.getSignedUrl(
        entity?.statement.id,
      );

      if (url) {
        entity.statement.url = url;
      }
    }
    return entity;
  }

  async update(
    id: number,
    updateBankDetailDto: UpdateBankDetailDto,
    userId: number,
    isAdmin: boolean = false,
  ) {
    const where: FindOptionsWhere<BankDetail> = { id };
    if (!isAdmin) {
      where.user = { id: userId };
    }
    const entity = await this.bankDetailsRepository.updateOne(
      where,
      updateBankDetailDto,
    );
    return entity;
  }

  async remove(id: number, userId: number) {
    const deleted = await this.bankDetailsRepository.softDelete({
      id: id,
      user: { id: userId },
    });
    return { deleted: deleted.affected === 1 };
  }
}
