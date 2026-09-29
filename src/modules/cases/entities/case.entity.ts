import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Admin } from '../../admin/entities/admin.entity';

@Entity('cases')
export class Case extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  clientId?: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'clientId' })
  client?: User;

  @Column({ type: 'uuid', nullable: true })
  assignedAdminId?: string;

  @ManyToOne(() => Admin, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'assignedAdminId' })
  assignedAdmin?: Admin;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  caseNumber?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  scamType?: string;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status: string;

  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  amountLost?: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'simple-array', default: '' })
  evidence: string[];

  @Column({ type: 'jsonb', nullable: true })
  actionPlan?: Record<string, any>;

  @Column({ type: 'timestamp with time zone', nullable: true })
  submittedAt?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  resolvedAt?: Date;
}
