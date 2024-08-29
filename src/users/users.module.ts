import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Student, StudentSchema } from 'src/students/schema/student.schema';
import { Staff, StaffSchema } from 'src/staffs/schema/staff.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Staff.name, schema: StaffSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [
    UsersService,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class UsersModule {}
