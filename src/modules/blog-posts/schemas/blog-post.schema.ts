import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/common/schemas/base.schema';

@Schema(BaseSchemaOptions)
export class BlogPost extends BaseEntity {
  @Prop({ required: false })
  author?: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: 'DRAFT' })
  status: string;

  @Prop()
  publishedAt: Date;
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
