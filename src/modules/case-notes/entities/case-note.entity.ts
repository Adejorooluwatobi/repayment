import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Case } from '../../cases/entities/case.entity';
import { Admin } from '../../admin/entities/admin.entity';

@Entity('case_notes')
export class CaseNote extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  caseId?: string;

  @ManyToOne(() => Case, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'caseId' })
  case?: Case;

  @Column({ type: 'uuid', nullable: true })
  adminId?: string;

  @ManyToOne(() => Admin, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'adminId' })
  admin?: Admin;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'boolean', default: true })
  isInternal: boolean;
}
