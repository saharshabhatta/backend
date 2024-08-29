import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schema/student.schema';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    UsersModule,
    AuthModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
  ],
})
export class StudentsModule {}
