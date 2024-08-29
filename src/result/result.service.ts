import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateResultDto } from './dto/create-result.dto';
import { ModuleService } from '../module/module.service';
import { Result, ResultDocument } from './schema/result.schema';
import { UsersService } from 'src/users/users.service';
import { ResultDetailDto } from './dto/result-detail.dto'; // Import ResultDetailDto

@Injectable()
export class ResultService {
  constructor(
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>, // Use ResultDocument type here
    private userService: UsersService,
    private moduleService: ModuleService,
  ) {}

  async createResult(
    createResultDto: CreateResultDto,
    req: Request,
  ): Promise<ResultDetailDto> {
    // Change return type to ResultDetailDto
    const { student_id, module_code } = createResultDto;

    // Check if the student exists
    const studentExists = await this.userService.findOne(student_id);
    if (!studentExists) {
      throw new NotFoundException('Student not found');
    }

    // Check if the module exists
    const moduleExists = await this.moduleService.findOne(module_code);
    if (!moduleExists) {
      throw new NotFoundException('Module not found');
    }

    // Create a new result
    const newResult = new this.resultModel({
      ...createResultDto,
      staff_id: req['user'].sub,
    });

    const result = await newResult.save();
    return this.mapToResultDetailDto(result); // Map to ResultDetailDto before returning
  }

  async findAll(search?: string): Promise<ResultDetailDto[]> {
    const query = search ? { module_code: search } : {};

    // Find results and sort by closest deadline first
    const results = await this.resultModel
      .find(query)
      .sort({ assignment_deadline: 1 })
      .exec();
    return results.map(this.mapToResultDetailDto);
  }

  async findOne(id: string): Promise<ResultDetailDto> {
    // Change return type to ResultDetailDto
    const result = await this.resultModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException('Result not found');
    }
    return this.mapToResultDetailDto(result); // Map to ResultDetailDto before returning
  }

  async updateResult(
    id: string,
    updateResultDto: Partial<CreateResultDto>,
    req: Request,
  ): Promise<ResultDetailDto> {
    if (updateResultDto.student_id) {
      const studentExists = await this.userService.findOne(
        updateResultDto.student_id,
      );
      if (!studentExists) {
        throw new NotFoundException('Student not found');
      }
    }

    if (updateResultDto.module_code) {
      const moduleExists = await this.moduleService.findOne(
        updateResultDto.module_code,
      );
      if (!moduleExists) {
        throw new NotFoundException('Module not found');
      }
    }

    const result = await this.resultModel
      .findByIdAndUpdate(
        id,
        { ...updateResultDto, staff_id: req['user'].sub },
        { new: true },
      )
      .exec();
    if (!result) {
      throw new NotFoundException('Result not found');
    }
    return this.mapToResultDetailDto(result); // Map to ResultDetailDto before returning
  }

  async deleteResult(id: string): Promise<void> {
    const result = await this.resultModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Result not found');
    }
  }

  async archiveResult(id: string): Promise<ResultDetailDto> {
    // Change return type to ResultDetailDto
    const result = await this.resultModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException('Result not found');
    }
    result.isArchived = true;
    await result.save();
    return this.mapToResultDetailDto(result); // Map to ResultDetailDto before returning
  }

  async unarchiveResult(id: string): Promise<ResultDetailDto> {
    // Change return type to ResultDetailDto
    const result = await this.resultModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException('Result not found');
    }
    result.isArchived = false;
    await result.save();
    return this.mapToResultDetailDto(result); // Map to ResultDetailDto before returning
  }

  private mapToResultDetailDto(result: ResultDocument): ResultDetailDto {
    return {
      _id: result._id,
      student_id: result.student_id,
      module_code: result.module_code,
      grade: result.grade,
      feedback: result.feedback,
      staff_id: result.staff_id,
      isArchived: result.isArchived,
    };
  }
}
