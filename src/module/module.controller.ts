import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { ModuleDetailDto } from './dto/module-detail.dto';
import { IsAuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { StaffGuard } from 'src/auth/guards/staff.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@ApiTags('Modules')
@Controller('modules')
@UseGuards(IsAuthenticatedGuard)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @ApiOperation({ summary: 'Create a new module' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The module has been successfully created.',
    type: ModuleDetailDto,
  })
  @ApiBody({ type: CreateModuleDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(StaffGuard)
  async create(
    @Body() createModuleDto: CreateModuleDto,
  ): Promise<ModuleDetailDto> {
    return this.moduleService.create(createModuleDto);
  }

  @ApiOperation({ summary: 'Update an existing module' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The module has been successfully updated.',
    type: ModuleDetailDto,
  })
  @ApiBody({ type: CreateModuleDto })
  @Patch(':code')
  @UseGuards(StaffGuard)
  async update(
    @Param('code') code: string,
    @Body() updateModuleDto: Partial<CreateModuleDto>,
  ): Promise<ModuleDetailDto> {
    return this.moduleService.update(code, updateModuleDto);
  }

  @ApiOperation({ summary: 'Get all modules' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all modules',
    type: [ModuleDetailDto],
  })
  @Get()
  async findAll(@Query() search?: string): Promise<ModuleDetailDto[]> {
    return this.moduleService.findAll(search);
  }

  @ApiOperation({ summary: 'Get a module by its code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The module details',
    type: ModuleDetailDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Module not found',
  })
  @Get(':code')
  async findOne(@Param('code') code: string): Promise<ModuleDetailDto> {
    return this.moduleService.findOne(code);
  }

  @ApiOperation({ summary: 'Delete a module by its code' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The module has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Module not found',
  })
  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  async delete(@Param('code') code: string): Promise<void> {
    await this.moduleService.delete(code);
  }

  @ApiOperation({ summary: 'Archive a module by its code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The module has been successfully archived.',
    type: ModuleDetailDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Module not found',
  })
  @UseGuards(StaffGuard)
  @Patch(':code/archive')
  async archive(@Param('code') code: string): Promise<ModuleDetailDto> {
    return this.moduleService.archive(code);
  }

  @ApiOperation({ summary: 'Unarchive a module by its code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The module has been successfully unarchived.',
    type: ModuleDetailDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Module not found',
  })
  @UseGuards(StaffGuard)
  @Patch(':code/unarchive')
  async unarchive(@Param('code') code: string): Promise<ModuleDetailDto> {
    return this.moduleService.unarchive(code);
  }
}
