import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { Admin } from 'src/modules/admin/schemas/admin.schema';
import { BaseEntity, BaseSchemaOptions } from 'src/common/schemas/base.schema';

@Schema(BaseSchemaOptions)
export class Consultation extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  clientId?: Types.ObjectId | User;

  @Prop({ type: String })
  caseType: string;

  @Prop({ type: Types.ObjectId, ref: 'Admin' })
  handledBy?: Types.ObjectId | Admin;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  scamType: string;

  @Prop({ type: Number })
  amountLost: number;

  @Prop()
  message: string;

  @Prop({ default: 'PENDING' })
  status: string;

  @Prop()
  notes: string;

  @Prop()
  scheduledAt: Date;
}

export const ConsultationSchema = SchemaFactory.createForClass(Consultation);
