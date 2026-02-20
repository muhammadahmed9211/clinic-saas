import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { repositories } from 'src/database/base-repository/advance.search';
import { App_Name, ListNames } from 'src/list-item/dto/create-list-item.dto';
import { ListItemService } from 'src/list-item/list-item.service';
import { RoleEnum } from 'src/roles/roles.enum';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class ListMetaDataSeedService {
  constructor(
    private readonly listItemService: ListItemService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async run() {
    const entities = Object.keys(repositories);
    const user = await this.userRepository.findOneBy({
      role: {
        id: RoleEnum.super_admin,
      },
    });
    if (!user) {
      throw new BadRequestException('Super Admin User not found');
    }
    for await (const name of entities) {
      const listItem = {
        appName: App_Name.ADMIN,
        name: ListNames[name],
      };
      const isExist = await this.listItemService.isExist(listItem);
      if (!isExist) {
        await this.listItemService.create(listItem, user.id);
      }
    }
  }
}
