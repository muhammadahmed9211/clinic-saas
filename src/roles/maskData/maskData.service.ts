import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MaskData } from '../entities/mask_data.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMaskDataDto } from './dto/createMaskData.dto';
import { NullableType } from 'src/utils/types/nullable.type';
import { UpdateMaskDataDto } from './dto/updatemaskData.dto';
import { RoleEnum } from '../roles.enum';
import { User } from 'src/users/entities/user.entity';
import { EventTypes } from 'src/common/services/event.type';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MaskDataService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(MaskData)
    private readonly maskDataRepository: Repository<MaskData>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(maskData: CreateMaskDataDto, user : User): Promise<MaskData> {
    if (maskData.roleId == RoleEnum.super_admin) {
      throw new BadRequestException('Cannot mask fields for super admin');
    }
    const findExistingMaskData = await this.maskDataRepository.findOne({
      where: {
        role: { id: maskData.roleId },
        key: maskData.key,
      },
      withDeleted: true,
    });

    if (findExistingMaskData) {
      throw new BadRequestException('Key or role is already in exists');
    }

    const createMaskData = this.maskDataRepository.create({
      ...maskData,
      role: { id: maskData.roleId },
    });
    await this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: {
        ...createMaskData,
      },
      oldData : {},
      entityId: maskData.roleId,
      entityType: 'Role',
      performerId: user?.id,
      performerType: 'Operator',
      field: 'Mask Keys Added',
    });
    return await this.maskDataRepository.save(createMaskData);
  }

  async getAll(): Promise<NullableType<MaskData[]>> {
    return await this.maskDataRepository.find({ relations: ['role'] });
  }

  async getById(id: number): Promise<NullableType<MaskData>> {
    const data = await this.maskDataRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!data) {
      throw new BadRequestException('Mask data not found');
    }

    return data;
  }

  async getByRoleId(id: number): Promise<NullableType<MaskData[]>> {
    const data = await this.maskDataRepository.find({
      where: { role: { id } },
      relations: ['role'],
    });

    if (!data) {
      throw new BadRequestException( 'Mask data not found');
    }

    return data;
  }

  async update(id: number, data: UpdateMaskDataDto, user : User) {
    if (data.roleId == RoleEnum.super_admin) {
      throw new BadRequestException('Cannot mask fields for super admin')
    }

    const existingMaskData = await this.maskDataRepository.findOne({
      where: { id },
    });

    if (!existingMaskData) {
      throw new BadRequestException('Mask data not found');
    }

    if (data.key || data.roleId) {
      const findExistingMaskData = await this.maskDataRepository.findOne({
        where: {
          role: { id: data.roleId },
          key: data.key,
        },
        withDeleted: true,
      });

      if (findExistingMaskData) {
        throw new BadRequestException('Key or role is already in exists');
      }
    }

    const updateData = {
      ...existingMaskData,
      ...data,
      role: { id: data.roleId },
    };
    await this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: {
        ...data,
      },
      oldData : {
        ...existingMaskData
      },
      entityId: data.roleId,
      entityType: 'Role',
      performerId: user?.id,
      performerType: 'Operator',
      field: 'Mask Keys Updated',
    });

    return await this.maskDataRepository.save(updateData);
  }

  async getAllKeysByRoleId(roleId: number): Promise<Partial<MaskData>[]> {
    return this.maskDataRepository.find({
      where: { role: { id: roleId } },
      select: ['key', 'maskPattern'],
    });
  }

  private maskNestedValues(
    data: any,
    keysToMask: Partial<MaskData>[],
    user: NullableType<User>,
  ): any {
    if (data == null) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.maskNestedValues(item, keysToMask, user));
    }

    if (typeof data === 'object' && data !== null) {
      if (data instanceof Date) return data;
      if (data instanceof RegExp) return data;
      if (data instanceof Map) return data;
      if (data instanceof Set) return data;
      if (data instanceof Buffer) return data;

      return Object.entries(data).reduce((acc, [key, value]) => {
        if (user && key in user && user[key] === value) {
          acc[key] = user[key];
          return acc;
        }
        const sensitiveKey = keysToMask.find((k) => k.key === key);
        acc[key] = sensitiveKey
          ? sensitiveKey.maskPattern
          : this.maskNestedValues(value, keysToMask, user);
        return acc;
      }, {});
    }

    return data;
  }

  async maskData(data: any, userId?: number): Promise<any> {
    let keysToMask: Partial<MaskData>[] = [];
    let user: NullableType<User> = null;

    if (userId) {
      user = await this.userRepository.findOne({
        where: { id: userId },
        relations: { role: true },
      });
      if (user?.role) {
        keysToMask = await this.getAllKeysByRoleId(user.role.id);
      }
    }

    return this.maskNestedValues(data, keysToMask, user);
  }

  async delete(id: number) {
    const row = await this.maskDataRepository.findOne({ where: { id } });
    if (!row) {
      throw new BadRequestException('Mask data not found');
    }
    return await this.maskDataRepository.softDelete(id);
  }
}
