import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/common/schemas/base.schema';

@Schema(BaseSchemaOptions)
export class ServicePackage extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: Number })
  pricePerTx: number;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ServicePackageSchema = SchemaFactory.createForClass(ServicePackage);
