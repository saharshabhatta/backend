import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type AssignmentDocument = HydratedDocument<Assignment>;

@Schema()
export class Assignment extends Document {
  @Prop({ required: true })
  module_code: string;

  @Prop({ required: true })
  assignment_brief: string;

  @Prop({ required: true })
  assignment_deadline: Date;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ required: true })
  assignment_url: string;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
