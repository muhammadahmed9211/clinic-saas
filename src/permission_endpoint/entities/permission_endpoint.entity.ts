import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionEndpointRel } from './permission_endpoint_rel.entity';

@Entity()
export class PermissionEndpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  isScreen: boolean;

  @Column({ nullable: true })
  method?: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  screen?: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(
    () => PermissionEndpointRel,
    (permissionEndpointRel) => permissionEndpointRel.permissionEndpoint,
  )
  permissionEndpointRel: PermissionEndpointRel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
