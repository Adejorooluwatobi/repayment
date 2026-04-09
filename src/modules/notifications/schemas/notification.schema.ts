import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { BaseEntity, BaseSchemaOptions } from 'src/common/schemas/base.schema';

@Schema(BaseSchemaOptions)
export class Notification extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId | User;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ type: Types.ObjectId })
  refId: Types.ObjectId;

  @Prop()
  refModel: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
