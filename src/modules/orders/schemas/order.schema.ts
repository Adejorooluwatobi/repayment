import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { Case } from 'src/modules/cases/schemas/case.schema';
import { ServicePackage } from 'src/modules/service-packages/schemas/service-package.schema';
import { BaseEntity, BaseSchemaOptions } from 'src/common/schemas/base.schema';

@Schema(BaseSchemaOptions)
export class Order extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  clientId: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: 'Case', required: true })
  caseId: Types.ObjectId | Case;

  @Prop({ type: Types.ObjectId, ref: 'ServicePackage', required: true })
  packageId: Types.ObjectId | ServicePackage;

  @Prop({ default: 'PENDING' })
  status: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop()
  paymentMethod: string;

  @Prop()
  paymentRef: string;

  @Prop()
  paidAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
