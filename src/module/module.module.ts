import { Module } from '@nestjs/common';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleSchema } from './schema/module.schema';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }]),
    CourseModule,
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [ModuleService],
})
export class ModuleModule {}
