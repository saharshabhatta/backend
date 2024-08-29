import { Module } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { Timetable, TimetableSchema } from './schema/timetable.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Timetable.name, schema: TimetableSchema },
    ]),
    CourseModule,
  ],
  providers: [TimetableService],
  controllers: [TimetableController],
})
export class TimetableModule {}
