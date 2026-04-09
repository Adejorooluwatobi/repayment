import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/common/schemas/base.schema';

@Schema({ 
  ...BaseSchemaOptions,
  toJSON: {
    ...BaseSchemaOptions.toJSON,
    transform: (doc: any, ret: any) => {
      delete ret.password;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})
export class Admin extends BaseEntity {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  department: string;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop()
  lastLogin: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
