import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { RoleService } from 'src/roles/role.service';
import { DataSource, Not, IsNull } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserLifeCycle } from 'src/utils/enums/user-lifecycle.enum';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(User, dataSource, listCacheService, roleService);
  }

  private async getIbUser(ibUserId: number) {
    const ibUser = await this.findOne({
      where: {
        id: ibUserId,
        partnerId: Not(IsNull()),
        partner: { userIbId: Not(IsNull()) },
      },
      relations: { partner: true },
    });

    if (!ibUser) {
      throw new BadRequestException('IB user not found or inactive.');
    }

    if (!ibUser.partner) {
      throw new BadRequestException(
        'Partner information for this IB user is missing.',
      );
    }

    return {
      user: ibUser,
      userIbId: ibUser.partner.userIbId,
      partnerId: ibUser.partner.id,
      uuid: ibUser.partner.uuid,
    };
  }

  async isUserAccessToIB(
    userId: number,
    ibUserId: number,
    userLifeCycle: UserLifeCycle = UserLifeCycle.CLIENT,
  ) {
    const { userIbId, uuid, partnerId } = await this.getIbUser(ibUserId);

    if (userLifeCycle === UserLifeCycle.LEAD) {
      const query = `
        SELECT * 
        FROM lead l
        WHERE l.id = @0
        AND (
          l.affid IN (
            SELECT p.uuid 
            FROM partner p
            CROSS APPLY STRING_SPLIT(p.ibpath, '>') AS s
            WHERE TRY_CAST(TRIM(s.value) AS BIGINT) = @1
          )
          OR l.affid = @2
        );
      `;

      const lead = await this.dataSource.query(query, [
        userId,
        Number(userIbId),
        uuid
      ]);

      if (!lead || lead.length === 0) {
        throw new BadRequestException(
          'This IB does not have permission to access the requested user.',
        );
      }

      return lead[0];
    }

    const query = `
      SELECT * 
      FROM client c
      WHERE c.userId = @0
      AND (
        c.affid IN (
          SELECT p.id 
          FROM partner p
          CROSS APPLY STRING_SPLIT(p.ibpath, '>') AS s
          WHERE TRY_CAST(TRIM(s.value) AS BIGINT) = @1
        )
        OR c.affid = @2
      );
    `;

    const user = await this.dataSource.query(query, [
      userId,
      Number(userIbId),
      partnerId,
    ]);

    if (!user || user.length === 0) {
      throw new BadRequestException(
        'This IB does not have permission to access the requested user.',
      );
    }

    return user[0];
  }

  async isUserAccessToLogin(login: string, ibUserId: number) {
    const { userIbId, partnerId } = await this.getIbUser(ibUserId);

    const query = `
      SELECT ma.* 
      FROM mt5_account ma
      JOIN client c ON c.userId = ma.userId
      JOIN partner p ON p.id = c.affid
      CROSS APPLY STRING_SPLIT(p.ibpath, '>') AS s
      WHERE c.login = @0
      AND (
        TRY_CAST(TRIM(s.value) AS BIGINT) = @1
        OR c.affid = @2
      );
    `;

    const mt5Account = await this.dataSource.query(query, [
      login,
      Number(userIbId),
      partnerId
    ]);

    if (!mt5Account || mt5Account.length === 0) {
      throw new BadRequestException(
        'This IB does not have permission to access the requested MT5 account.',
      );
    }

    return mt5Account[0];
  }
}
