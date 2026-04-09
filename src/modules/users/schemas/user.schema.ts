import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/common/schemas/base.schema';

@Schema({ 
  ...BaseSchemaOptions,
  toJSON: {
    ...BaseSchemaOptions.toJSON,
    transform: (doc: any, ret: any) => {
      delete ret.passwordHash;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})
export class User extends BaseEntity {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop()
  phone: string;

  @Prop({ default: 'USER' })
  role: string;

  @Prop({ default: 'ACTIVE' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
