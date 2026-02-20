import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CustomStatus,
  StatusType,
} from 'src/admin/client/entities/custom_status.entity';
import { Like, Repository } from 'typeorm';
import { Desk } from './entities/desk.entity';
import { OperatorDeskRel } from './entities/operator-desk.entity';
import { Operator } from './entities/operator.entity';
import { RejectedReason } from 'src/admin/kyc/entities/rejected_reasons.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { Office } from './entities/office.entity';
import { DeskType } from './entities/desk_type.entity';
import { ClientType } from './dto/custom-status.dto';
import { RoleService } from 'src/roles/role.service';
import { User } from 'src/users/entities/user.entity';
import { LevelEnum } from 'src/roles/filter_level.enum';
import ISO6391 from 'iso-639-1';

@Injectable()
export class CustomDropdownService {
  constructor(
    @InjectRepository(CustomStatus)
    private readonly customStatusRepository: Repository<CustomStatus>,
    @InjectRepository(Desk)
    private readonly DeskRepository: Repository<Desk>,
    @InjectRepository(OperatorDeskRel)
    private readonly OperatorDeskRelRepository: Repository<OperatorDeskRel>,
    @InjectRepository(Operator)
    private readonly OperatorRepository: Repository<Operator>,
    @InjectRepository(RejectedReason)
    private readonly rejectedReasonRepository: Repository<RejectedReason>,
    @InjectRepository(LabelTranslation)
    private readonly labelTranslationRepository: Repository<LabelTranslation>,
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
    @InjectRepository(DeskType)
    private readonly deskTypeRepository: Repository<DeskType>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) { }

  async getClientInfo(type: StatusType) {
    const lowerCaseType = type.toLowerCase() as StatusType;
    const info = await this.customStatusRepository.find({
      where: {
        type: lowerCaseType,
      },
      order: {
        sort: 'ASC',
      },
    });
    if (lowerCaseType === 'client_type') {
      info.forEach((item) => {
        for (const key in ClientType) {
          if (item.name === key) {
            item['abbreviation'] = ClientType[key];
            break;
          }
        }
      });
    }
    return info;
  }

  async getDropdown(type: number, search?: string): Promise<any> {
    const searchCondition = search
      ? { name: Like(`%${search.toLowerCase()}%`) }
      : {};

    return await this.DeskRepository.find({
      where: {
        type,
        ...searchCondition,
      },
      select: ['id', 'name'],
      order: {
        name: 'ASC',
      },
    });
  }


  async getRejectedReasons(userLang: string): Promise<any> {
    const data = await this.rejectedReasonRepository.find({
      relations: {
        label: {
          labelTranslation: true,
        },
      },
      where: { label: { labelTranslation: { langCode: userLang } } },
    });

    const detailedData = await Promise.all(
      data.map(async (dat) => {
        const labelTranslation = await this.labelTranslationRepository.findOne({
          where: {
            label: { id: dat.label.id },
            langCode: userLang,
          },
        });

        const translationText = labelTranslation ? labelTranslation.text : null;

        return {
          rejectedReasonId: dat.id,
          labelId: dat.label.id,
          translationText: translationText,
        };
      }),
    );
    return detailedData;
  }

  async getOperator(id: number, user: User): Promise<any> {
    // const findUser = await this.userRepository.findOne({
    //   where: { id: user.id, operator: { is_active: true } },
    // });

    // if (!findUser?.role) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.UNPROCESSABLE_ENTITY,
    //       error: {
    //         msg: 'Role not found',
    //       },
    //     },
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }
    // const roleFilterData = await this.roleService.roleFilterData(
    //   findUser.role.id,
    // );
    // let whereClause: any = {};

    // Object.entries(roleFilterData).forEach(([filterName, filterData]) => {
    //   const { ids } = filterData;

    //   if (filterName === 'level') {
    //     const levelNames = ids.map(
    //       (id) => LevelEnum.find((level) => level.id === id)?.name,
    //     );

    //     if (levelNames.includes('self')) {
    //       whereClause.id = findUser.operator.id;
    //     } else if (levelNames.includes('team')) {
    //       whereClause.manager_operator_id = findUser.operator.id;
    //     }
    //     // } else {
    //     //   if (condition === 'OR') {
    //     //     whereClause[filterName] = In(ids);
    //     //   } else if (condition === 'AND') {
    //     //     whereClause[filterName] = ids[0]; // For AND, we assume single value
    //     //   }
    //   }
    // });

    // if (id) {
    //   whereClause = {
    //     ...whereClause,
    //     operator_rel: { desk: { id } },
    //   };
    // }

    // return await this.OperatorRepository.find({
    //   where: whereClause,
    //   select: {
    //     id: true,
    //     full_name: true,
    //     email: true,
    //     is_active: true,
    //   },
    //   order: { full_name: 'asc' },
    // });
    return await this.OperatorRepository.find({
      where: { operator_rel: { desk: { id } }, is_active: true},
      select: {
        id: true,
        full_name: true,
        email: true,
        is_active: true,
      },
      order: { full_name: 'asc' },
    });
  }

  async getOffices(search?: string): Promise<any> {
    const searchCondition = search
      ? { name: Like(`%${search.toLowerCase()}%`) }
      : {};
  
    const offices = await this.officeRepository.find({
      where: {
        ...searchCondition,
      },
      select: ['id', 'name'],
      order: {
        name: 'ASC',
      },
    });
  
    return offices.map((office) => ({
      ...office,
      id: Number(office.id),
    }));
  }
  
  async getDeskTypes(): Promise<any> {
    const deskTypes = await this.deskTypeRepository.find({
      select: {
        id: true,
        name: true,
      },
    });
    deskTypes.forEach((deskType) => {
      deskType.id = Number(deskType.id);
    });

    return deskTypes;
  }

  async getAllDesk(): Promise<any> {
    const desk = await this.DeskRepository.find({
      select: {
        id: true,
        name: true,
      },
    });

    return desk;
  }

  async getAllLanguages(): Promise<any> {
    const languages = ISO6391.getLanguages(ISO6391.getAllCodes())
    if(languages.length < 1) {
      throw new NotFoundException('Languages not found');
    }
    return languages;
  }
}
