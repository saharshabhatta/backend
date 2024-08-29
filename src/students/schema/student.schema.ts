import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type StudentDocument = HydratedDocument<Student>;

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
  OTHERS = 'O',
}

export enum Level {
  L4 = 'L4',
  L5 = 'L5',
  L6 = 'L6',
}

@Schema()
export class Student {
  @Prop({ required: true, type: ObjectId, ref: User.name })
  user_id: ObjectId;

  @Prop({ required: true })
  unid: string;

  @Prop({ required: true, enum: Level })
  level: Level;

  @Prop({ required: true })
  name: string;

  //TODO: convert it to id
  // @Prop({ required: false })
  @Prop({ required: true })
  course_id: string;

  @Prop({ required: true })
  dob: string;

  @Prop({ required: true, enum: Gender })
  gender: Gender;

  @Prop({ default: false })
  isArchived: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
