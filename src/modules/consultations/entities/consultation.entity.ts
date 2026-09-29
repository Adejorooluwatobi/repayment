import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Admin } from '../../admin/entities/admin.entity';

@Entity('consultations')
export class Consultation extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  clientId?: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'clientId' })
  client?: User;

  @Column({ type: 'uuid', nullable: true })
  handledBy?: string;

  @ManyToOne(() => Admin, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'handledBy' })
  handler?: Admin;

  @Column({ type: 'varchar', length: 100, nullable: true })
  caseType?: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  scamType?: string;

  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  amountLost?: number;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  scheduledAt?: Date;
}
