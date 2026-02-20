import { JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { EntityHelper } from '../../utils/entity-helper';
import { Role } from 'src/roles/entities/role.entity';
import { Privilege } from './privilege.entity';

// @Entity()
@Unique(['role', 'privilege'])
export class RolePrivilege extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => Privilege, { eager: true })
  @JoinColumn({ name: 'privilegeId' })
  privilege: Privilege;
}
