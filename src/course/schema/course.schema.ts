import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  @Prop({ required: true, unique: true })
  course_id: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  leader: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  staff_id: Types.ObjectId;

  @Prop({ default: false })
  isArchived: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
