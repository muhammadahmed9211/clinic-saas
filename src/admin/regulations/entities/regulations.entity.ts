import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RegulationTranslations } from './regulations-translation.entity';
import { RegulationBlockedCountries } from './regulation-blocked-countries.entity';
import { EmailMapping } from 'src/admin/email-mapping/entity/email-mapping.entity';
import { Layout } from 'src/mail/entities/layout.entity';
import { RegulationEventRuleMapping } from '../regulations-config/entities/regulation-event-rule-mapping.entity';
import { Label } from 'src/tasks/entities/label.entity';
@Entity()
export class Regulations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  regulatedCountry: string;

  @ManyToOne(() => Label, (label) => label.regulations, { cascade: true })
  @JoinColumn()
  regulatedByLabel: Label;

  @ManyToOne(() => Label, (label) => label.licenses, { cascade: true })
  @JoinColumn()
  licenseLabel: Label;

  @Column({ nullable: true })
  domain: string;

  @Column({ nullable: true })
  clientportal_url: string;

  @Column({ nullable: true })
  smtp_host: string;

  @Column({ nullable: true })
  smtp_port: string;

  @Column({ nullable: true })
  smtp_username: string;

  @Column({ nullable: true })
  smtp_password: string;

  @Column({ nullable: true , default: false})
  smtp_secure: boolean;

  @Column({ nullable: true })
  from_email: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  subDomain: string;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  domainExtension: string[];

  @OneToMany(
    () => RegulationTranslations,
    (translation) => translation.regulation,
  )
  translations: RegulationTranslations[];

  @OneToMany(
    () => RegulationBlockedCountries,
    (blockedCountries) => blockedCountries.regulation,
  )
  blockedCountries: RegulationBlockedCountries[];

  @Column({ nullable: true })
  createdBy: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(
    () => RegulationEventRuleMapping,
    (eventRule) => eventRule.regulation,
  )
  eventRule: RegulationEventRuleMapping;

  @OneToMany(
    () => Layout,
    (layout) => layout.regulationId,
  )
  layout: Layout;

  @Column({ nullable: true })
  tradingGroupPrefix: string;

  @Column({ nullable: true })
  tradingGroupSuffix: string;

  @OneToMany(
    () => EmailMapping,
    (emailMapping) => emailMapping.regulation,
  )
  emailMapping: EmailMapping;
}
