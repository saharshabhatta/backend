import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module } from './schema/module.schema';
import { CreateModuleDto } from './dto/create-module.dto';
import { ModuleDetailDto } from './dto/module-detail.dto';
import { CourseService } from 'src/course/course.service';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name) private readonly moduleModel: Model<Module>,
    private readonly courseService: CourseService,
  ) {}

  async create(createModuleDto: CreateModuleDto): Promise<ModuleDetailDto> {
    // Check if course exists
    const course = await this.courseService.findById(createModuleDto.course_id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    let createdModule;
    // Save module
    try {
      createdModule = new this.moduleModel(createModuleDto);
      await createdModule.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Module with code ${createModuleDto.module_code} already exists`,
        );
      }

      throw new BadRequestException(`Error`);
    }

    return this.mapModuleToDto(createdModule);
  }

  async update(
    code: string,
    updateModuleDto: Partial<CreateModuleDto>,
  ): Promise<ModuleDetailDto> {
    if (updateModuleDto.course_id) {
      const course = await this.courseService.findById(
        updateModuleDto.course_id,
      );
      if (!course) {
        throw new NotFoundException('Course not found');
      }
    }

    let updatedModule;

    try {
      updatedModule = await this.moduleModel
        .findOneAndUpdate({ module_code: code }, updateModuleDto, { new: true })
        .exec();
      if (!updatedModule) {
        throw new NotFoundException(`Module with code ${code} not found`);
      }
    } catch (error) {
      if (error.code === 11000)
        throw new BadRequestException(
          `Module with code ${code} already exists`,
        );

      throw new BadRequestException(`Error`);
    }

    return this.mapModuleToDto(updatedModule);
  }

  async findAll(search?: string): Promise<ModuleDetailDto[]> {
    const filter = search ? { name: new RegExp(search, 'i') } : {};
    const modules = await this.moduleModel.find(filter).exec();
    return modules.map((module) => this.mapModuleToDto(module));
  }

  async findOne(code: string): Promise<ModuleDetailDto> {
    const module = await this.moduleModel.findOne({ module_code: code }).exec();
    if (!module) {
      throw new NotFoundException(`Module with code ${code} not found`);
    }
    return this.mapModuleToDto(module);
  }

  async delete(code: string): Promise<void> {
    const deletedModule = await this.moduleModel
      .findOneAndDelete({ module_code: code })
      .exec();
    if (!deletedModule) {
      throw new NotFoundException(`Module with code ${code} not found`);
    }
  }

  async archive(code: string): Promise<ModuleDetailDto> {
    const updatedModule = await this.moduleModel
      .findOneAndUpdate(
        { module_code: code },
        { isArchived: true },
        { new: true },
      )
      .exec();
    if (!updatedModule) {
      throw new NotFoundException(`Module with code ${code} not found`);
    }

    return this.mapModuleToDto(updatedModule);
  }

  async unarchive(code: string): Promise<ModuleDetailDto> {
    const updatedModule = await this.moduleModel
      .findOneAndUpdate(
        { module_code: code },
        { isArchived: false },
        { new: true },
      )
      .exec();
    if (!updatedModule) {
      throw new NotFoundException(`Module with code ${code} not found`);
    }

    return this.mapModuleToDto(updatedModule);
  }

  private mapModuleToDto(module: Module): ModuleDetailDto {
    return {
      module_code: module.module_code,
      course_id: module.course_id.toString(),
      name: module.name,
      description: module.description,
      isArchived: module.isArchived,
    };
  }
}
