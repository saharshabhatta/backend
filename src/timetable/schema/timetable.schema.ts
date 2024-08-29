import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TimetableDocument = HydratedDocument<Timetable>;

export enum Level {
  L4 = 'L4',
  L5 = 'L5',
  L6 = 'L6',
}

@Schema()
export class Timetable {
  @Prop({ required: true })
  course_id: string;

  @Prop({ enum: Level, required: true })
  level: Level;

  @Prop({ default: false })
  shift_1: boolean;

  @Prop({ default: false })
  shift_2: boolean;

  @Prop({ default: false })
  is_archived: boolean;

  @Prop()
  pdf_url?: string;
}

export const TimetableSchema = SchemaFactory.createForClass(Timetable);
