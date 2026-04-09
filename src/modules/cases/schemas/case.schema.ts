import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { Admin } from 'src/modules/admin/schemas/admin.schema';
import { BaseEntity, BaseSchemaOptions } from 'src/common/schemas/base.schema';

@Schema(BaseSchemaOptions)
export class Case extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  clientId?: Types.ObjectId | User;

  @Prop({ unique: true, sparse: true })
  caseNumber?: string;

  @Prop()
  scamType?: string;

  @Prop({ default: 'PENDING' })
  status?: string;

  @Prop({ type: Number })
  amountLost?: number;

  @Prop({ default: 'USD' })
  currency?: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  evidence?: string[];

  @Prop({ type: Object })
  // actionPlan: any;

  @Prop()
  submittedAt?: Date;

  @Prop()
  resolvedAt?: Date;
}

export const CaseSchema = SchemaFactory.createForClass(Case);
