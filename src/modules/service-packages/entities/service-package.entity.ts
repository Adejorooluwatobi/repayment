import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('service_packages')
export class ServicePackage extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  pricePerTx?: number;

  @Column({ type: 'simple-array', default: '' })
  features: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
