import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ModuleDocument = HydratedDocument<Module>;

@Schema()
export class Module {
  @Prop({ required: true, unique: true })
  module_code: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course_id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: false })
  isArchived: boolean;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
