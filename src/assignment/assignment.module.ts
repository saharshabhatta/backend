import { Module } from '@nestjs/common';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { Assignment, AssignmentSchema } from './schema/assignment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleModule } from 'src/module/module.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assignment.name, schema: AssignmentSchema },
    ]),
    ModuleModule,
  ],
  controllers: [AssignmentController],
  providers: [AssignmentService],
})
export class AssignmentModule {}
