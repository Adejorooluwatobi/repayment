import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { Case } from 'src/modules/cases/schemas/case.schema';
import { ServicePackage } from 'src/modules/service-packages/schemas/service-package.schema';
import { BaseEntity, BaseSchemaOptions } from 'src/common/schemas/base.schema';

@Schema(BaseSchemaOptions)
export class Order extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  clientId?: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: 'Case' })
  caseId?: Types.ObjectId | Case;

  @Prop({ type: Types.ObjectId, ref: 'ServicePackage' })
  packageId?: Types.ObjectId | ServicePackage;

  @Prop({ default: 'PENDING' })
  status: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
