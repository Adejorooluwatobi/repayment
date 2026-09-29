import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Case } from '../../cases/entities/case.entity';
import { ServicePackage } from '../../service-packages/entities/service-package.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  clientId?: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'clientId' })
  client?: User;

  @Column({ type: 'uuid', nullable: true })
  caseId?: string;

  @ManyToOne(() => Case, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'caseId' })
  case?: Case;

  @Column({ type: 'uuid', nullable: true })
  packageId?: string;

  @ManyToOne(() => ServicePackage, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'packageId' })
  package?: ServicePackage;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;
}
