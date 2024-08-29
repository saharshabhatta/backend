import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Student } from 'src/students/schema/student.schema';
import { UserRole } from './types/types';
import { ObjectId } from 'mongodb';
import { Staff } from 'src/staffs/schema/staff.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<UserDocument> {
    const userId = new ObjectId(id);

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.role === UserRole.STUDENT) {
      const student = await this.studentModel
        .deleteOne({ user_id: userId })
        .exec();
      if (student.deletedCount === 0) {
        throw new NotFoundException(`Staff with ID ${id} not found`);
      }
    }

    if (user.role === UserRole.STAFF) {
      const staff = await this.staffModel
        .deleteOne({ user_id: userId.toString() })
        .exec();
      if (staff.deletedCount == 0) {
        throw new NotFoundException(`Staff with ID ${id} not found`);
      }
    }

    const result = await this.userModel.findByIdAndDelete(userId).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return result;
  }
}
