import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Result, ResultSchema } from './schema/result.schema';
import { UsersModule } from 'src/users/users.module';
import { ModuleModule } from 'src/module/module.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
    UsersModule,
    ModuleModule,
  ],
  providers: [ResultService],
  controllers: [ResultController],
})
export class ResultModule {}
