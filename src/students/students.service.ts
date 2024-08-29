import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Student, StudentDocument } from './schema/student.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateUserStudentDto } from './dto/create-user-student.dto';
import { AuthService } from 'src/auth/auth.service';
import { ObjectId } from 'mongodb';
import { StudentDetailsDto } from './dto/student-details.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UsersService } from 'src/users/users.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UserRole } from 'src/users/types/types';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async create(createUserStudentDto: CreateUserStudentDto): Promise<Student> {
    const createUserDto = {
      email: createUserStudentDto.email,
      password: createUserStudentDto.password,
      role: UserRole.STUDENT,
    };

    const savedUser = await this.createUser(createUserDto);

    const createStudentDto: CreateStudentDto = {
      user_id: savedUser._id,
      unid: createUserStudentDto.unid,
      level: createUserStudentDto.level,
      name: createUserStudentDto.name,
      course_id: createUserStudentDto.course_id,
      dob: createUserStudentDto.dob,
      gender: createUserStudentDto.gender,
    };

    return this.saveStudent(createStudentDto);
  }

  async findById(id: string): Promise<StudentDetailsDto> {
    const userId = new ObjectId(id);

    const user = await this.usersService.findOne(userId.toString());
    const student = await this.findStudentByUserId(userId);

    return this.mapToStudentDetailsDto(user, student);
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDetailsDto> {
    const userId = new ObjectId(id);

    if (updateStudentDto.email) {
      try {
        await this.usersService.updateUser(userId.toString(), {
          email: updateStudentDto.email,
        });
      } catch (error) {
        if (error.code && error.code === 11000) {
          throw new BadRequestException(`User with email exists`);
        }
        throw new BadRequestException('Invalid email format');
      }
    }

    if (updateStudentDto.password) {
      await this.authService.updatePassword(
        userId.toString(),
        updateStudentDto.password,
      );
    }

    const student = await this.updateStudent(userId, updateStudentDto);
    const updatedUser = await this.usersService.findOne(userId.toString());

    return this.mapToStudentDetailsDto(updatedUser, student);
  }

  async archiveStudent(id: string) {
    const userId = new ObjectId(id);

    const student = await this.studentModel
      .findOneAndUpdate(
        { user_id: userId },
        { isArchived: true },
        { new: true },
      )
      .exec();

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async unarchiveStudent(id: string) {
    const userId = new ObjectId(id);

    const student = await this.studentModel
      .findOneAndUpdate(
        { user_id: userId },
        { isArchived: false },
        { new: true },
      )
      .exec();

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }
  async findAll({
    page = 1,
    limit = 10,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<StudentDetailsDto[]> {
    const skip = (page - 1) * limit;

    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { unid: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const students = await this.studentModel
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .exec();

    const studentDetails = await Promise.all(
      students.map(async (student) => {
        const user = await this.usersService.findOne(
          student.user_id.toString(),
        );
        return this.mapToStudentDetailsDto(user, student);
      }),
    );

    return studentDetails;
  }

  private async createUser(createUserDto: {
    email: string;
    password: string;
    role: UserRole;
  }) {
    try {
      return await this.authService.singUp(createUserDto);
    } catch (error) {
      if (error.code && error.code === 11000) {
        throw new BadRequestException(`User with email exists`);
      }
      throw new BadRequestException(`User creation failed: ${error.message}`);
    }
  }

  private async saveStudent(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentDocument> {
    try {
      const student = new this.studentModel(createStudentDto);
      return await student.save();
    } catch (error) {
      throw new BadRequestException(
        `Student creation failed: ${error.message}`,
      );
    }
  }

  private async findStudentByUserId(
    userId: ObjectId,
  ): Promise<StudentDocument> {
    const student = await this.studentModel.findOne({ user_id: userId });
    if (!student) {
      throw new NotFoundException(`Student with user ID ${userId} not found`);
    }
    return student;
  }

  private async updateStudent(
    userId: ObjectId,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const student = await this.studentModel
      .findOneAndUpdate({ user_id: userId }, updateStudentDto, { new: true })
      .exec();
    if (!student) {
      throw new NotFoundException(`Student with user ID ${userId} not found`);
    }
    return student;
  }

  private mapToStudentDetailsDto(
    user: UserDocument,
    student: Student,
  ): StudentDetailsDto {
    return {
      user_id: user._id,
      unid: student.unid,
      email: user.email,
      name: student.name,
      dob: student.dob,
      level: student.level,
      course_id: student.course_id,
      gender: student.gender,
      role: user.role,
      isArchived: student.isArchived,
    };
  }
}
