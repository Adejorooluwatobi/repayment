import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BaseEntity extends Document {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  // TypeScript definition for the virtual 'id' field provided by Mongoose
  id: string;
}

export const BaseSchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
  },
};
