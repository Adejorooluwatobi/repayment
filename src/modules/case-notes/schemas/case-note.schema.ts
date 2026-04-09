import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Case } from 'src/modules/cases/schemas/case.schema';
import { Admin } from 'src/modules/admin/schemas/admin.schema';
import { BaseEntity, BaseSchemaOptions } from 'src/common/schemas/base.schema';

@Schema(BaseSchemaOptions)
export class CaseNote extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'Case', required: true })
  caseId: Types.ObjectId | Case;

  @Prop({ type: Types.ObjectId, ref: 'Admin', required: true })
  adminId: Types.ObjectId | Admin;

  @Prop({ required: true })
  content: string;

  @Prop({ default: true })
  isInternal: boolean;
}

export const CaseNoteSchema = SchemaFactory.createForClass(CaseNote);
