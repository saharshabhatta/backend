import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { StudentsModule } from './students/students.module';
import { StaffsModule } from './staffs/staff.module';
import { CourseModule } from './course/course.module';
import { ModuleModule } from './module/module.module';
import { AssignmentModule } from './assignment/assignment.module';
import { ResultModule } from './result/result.module';
import { TimetableModule } from './timetable/timetable.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Should be moved to auth??
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_DURATION },
      }),
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
    }),

    UsersModule,
    AuthModule,
    StudentsModule,
    StaffsModule,
    CourseModule,
    ModuleModule,
    AssignmentModule,
    ResultModule,
    TimetableModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
