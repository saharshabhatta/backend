import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type StaffDocument = HydratedDocument<Staff>;

@Schema()
export class Staff {
  @Prop({ required: true, type: ObjectId, ref: User.name })
  user_id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dob: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: false })
  isArchived: boolean;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
