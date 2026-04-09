import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { BaseEntity, BaseSchemaOptions } from 'src/common/schemas/base.schema';

@Schema(BaseSchemaOptions)
export class Testimonial extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  clientId: Types.ObjectId | User;

  @Prop({ required: true })
  authorName: string;

  @Prop()
  country: string;

  @Prop()
  scamType: string;

  @Prop({ type: Number, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  content: string;

  @Prop()
  videoUrl: string;

  @Prop({ default: false })
  approved: boolean;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
