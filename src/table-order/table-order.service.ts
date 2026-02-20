import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTableColumnOrderDto } from './dto/create-table-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TableColumnOrder } from './entities/table-order.entity';
import { DeepPartial, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { TablesName } from './types';

@Injectable()
export class TableOrderService {
  constructor(
    @InjectRepository(TableColumnOrder)
    private readonly tableColumnOrderRepository: Repository<TableColumnOrder>,
  ) {}
  async create(dto: CreateTableColumnOrderDto, userId: User['id']) {
    const { tableName, data: columns } = dto;
    const isExist = await this.tableColumnOrderRepository.find({
      where: {
        tableName,
        user: { id: userId },
      },
    });

    const maxOrder = columns.length;
    const tableColumns: DeepPartial<TableColumnOrder>[] = [];
    const toBeDeletedIds: number[] = [];
    const allColumnsIds = {};
    const allNewColumnsIds = {};

    const allOrders = {};

    columns.forEach((column) => {
      if (column.id) {
        allNewColumnsIds[column.id] = true;
      }
    });

    isExist.forEach((column) => {
      if (allNewColumnsIds[column.id]) {
        allColumnsIds[column.id] = true;
      } else {
        toBeDeletedIds.push(column.id);
      }
    });

    for (const column of columns) {
      if (column.id && !allColumnsIds[column.id]) {
        throw new BadRequestException('Invalid table column id');
      } else if (column.order > maxOrder) {
        throw new BadRequestException(`Max order should be ${maxOrder}`);
      } else if (allOrders[column.order]) {
        throw new BadRequestException(`Order ${column.order} is already taken`);
      }
      allOrders[column.order] = true;

      const newColumn = this.tableColumnOrderRepository.create({
        ...column,
        tableName,
        user: { id: userId },
      });
      tableColumns.push(newColumn);
    }
    const entities = await this.tableColumnOrderRepository.save(tableColumns);

    if (toBeDeletedIds.length) {
      await this.tableColumnOrderRepository.softDelete(toBeDeletedIds);
    }
    return entities;
  }

  async findAll(tableName: TablesName, userId: User['id']) {
    const entities = await this.tableColumnOrderRepository.findBy({
      tableName,
      user: {
        id: userId,
      },
    });
    return entities;
  }
}
