import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment } from './schema/assignment.schema';
import { AssignmentDetailDto } from './dto/assignment-detail.dto';
import { ModuleService } from '../module/module.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectModel(Assignment.name)
    private readonly assignmentModel: Model<Assignment>,
    private readonly moduleService: ModuleService,
  ) {}

  async create(
    createAssignmentDto: CreateAssignmentDto,
    assignment_url: string,
  ): Promise<AssignmentDetailDto> {
    // Check if the module exists
    const moduleExists = await this.moduleService.findOne(
      createAssignmentDto.module_code,
    );
    if (!moduleExists) {
      throw new NotFoundException(
        `Module with code ${createAssignmentDto.module_code} not found`,
      );
    }

    const createdAssignment = await this.assignmentModel.create({
      ...createAssignmentDto,
      assignment_url: assignment_url,
    });

    return this.mapToDto(createdAssignment);
  }

  async findAll(search?: string): Promise<AssignmentDetailDto[]> {
    const filter = search
      ? { module_code: { $regex: search, $options: 'i' } }
      : {};

    const assignments = await this.assignmentModel
      .find(filter)
      .sort({ assignment_deadline: 1 }) // Closest deadline first
      .exec();

    return assignments.map(this.mapToDto);
  }

  async findOne(id: string): Promise<AssignmentDetailDto> {
    // Find assignment by ID
    const assignment = await this.assignmentModel.findById(id).exec();
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return this.mapToDto(assignment);
  }

  async update(
    id: string,
    updateAssignmentDto: Partial<CreateAssignmentDto>,
    assignment_url: string,
  ): Promise<AssignmentDetailDto> {
    // If module code is being updated, ensure it exists
    if (updateAssignmentDto.module_code) {
      const moduleExists = await this.moduleService.findOne(
        updateAssignmentDto.module_code,
      );
      if (!moduleExists) {
        throw new NotFoundException(
          `Module with code ${updateAssignmentDto.module_code} not found`,
        );
      }
    }

    let updatedAssignment;
    // Update the assignment and check if it exists
    if (!assignment_url) {
      updatedAssignment = await this.assignmentModel
        .findByIdAndUpdate(id, updateAssignmentDto, { new: true })
        .exec();
    } else {
      updatedAssignment = await this.assignmentModel
        .findByIdAndUpdate(
          id,
          { ...updateAssignmentDto, assignment_url },
          { new: true },
        )
        .exec();
    }

    if (!updatedAssignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return this.mapToDto(updatedAssignment);
  }

  async delete(id: string): Promise<void> {
    // Delete the assignment and check if it exists
    const deletedAssignment = await this.assignmentModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedAssignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
  }

  async archive(id: string): Promise<AssignmentDetailDto> {
    // Archive the assignment
    const archivedAssignment = await this.assignmentModel
      .findByIdAndUpdate(id, { isArchived: true }, { new: true })
      .exec();
    if (!archivedAssignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return this.mapToDto(archivedAssignment);
  }

  async unarchive(id: string): Promise<AssignmentDetailDto> {
    // Unarchive the assignment
    const unarchivedAssignment = await this.assignmentModel
      .findByIdAndUpdate(id, { isArchived: false }, { new: true })
      .exec();
    if (!unarchivedAssignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return this.mapToDto(unarchivedAssignment);
  }

  // Map the assignment to its DTO format
  private mapToDto(assignment: Assignment): AssignmentDetailDto {
    return {
      id: assignment._id.toString(),
      module_code: assignment.module_code,
      assignment_brief: assignment.assignment_brief,
      assignment_url: assignment.assignment_url,
      assignment_deadline: assignment.assignment_deadline,
      isArchived: assignment.isArchived,
    };
  }
}
