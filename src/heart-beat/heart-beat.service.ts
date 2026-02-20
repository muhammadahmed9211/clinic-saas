import { Injectable } from '@nestjs/common';
import { RedisCoreService } from 'src/redis/redis.service';
import { CreateHeartBeatDto } from './dtos/create-heartbeat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class HeartBeatService {
  constructor(
    private readonly redis: RedisCoreService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly fileService: FilesService,
  ) {}

  async updateHeartbeat(dto: CreateHeartBeatDto): Promise<string> {
    const heartbeat = await this.redis.set({
      key: `userId:${dto.userId}`,
      value: `${(Date.now(), 'EX', 60)}`,
    });
    return 'Heartbeat updated successfully: ' + heartbeat;
  }

  async getActiveUsers(paginationOptions: any) {
    const keys = await this.redis.key({ key: 'userId:*' });
    const valuesArray = keys.map((item) => parseInt(item.split(':')[1]));

    const startIndex = (paginationOptions.page - 1) * paginationOptions.limit;
    const endIndex = Math.min(
      startIndex + paginationOptions.limit,
      valuesArray.length,
    );

    let paginatedValuesArray;
    if (!paginationOptions.all) {
      paginatedValuesArray = valuesArray.slice(startIndex, endIndex);
    } else {
      paginatedValuesArray = valuesArray;
    }

    const activeUsers = await this.userRepository.find({
      where: { id: In(paginatedValuesArray) },
    });

    const userPromises = activeUsers.map(async (user) => {
      if (user.photo) {
        user.photo = await this.fileService.getSignedUrl(user.photo.id);
      }
      return {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        photo: user.photo,
        country: user.country,
        creationTime: user.createdAt,
      };
    });

    const paginatedUsers = await Promise.all(userPromises);

    return {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
      total: valuesArray.length,
      users: paginatedUsers,
    };
  }
}
