import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Staff, StaffSchema } from './schema/staff.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Staff.name, schema: StaffSchema }]),
    AuthModule,
    UsersModule,
  ],
  providers: [StaffService],
  controllers: [StaffController],
})
export class StaffsModule {}
