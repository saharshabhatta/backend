import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type ResultDocument = HydratedDocument<Result>;

@Schema()
export class Result {
  @Prop({ required: true })
  student_id: Types.ObjectId;

  @Prop({ required: true })
  module_code: string;

  @Prop({ required: true })
  grade: string;

  @Prop({ required: false })
  feedback?: string;

  @Prop({ required: true })
  staff_id: Types.ObjectId;

  @Prop({ default: false })
  isArchived: boolean;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
