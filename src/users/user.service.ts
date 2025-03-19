import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dtos/user.dto';
import { UserRepository } from './user.repository';
import { USER_ROLE } from './users-types';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAllUsers(): Promise<UserResponseDto[]> {
    return this.userRepository.findAllUsers();
  }

  async findUserById(id: string): Promise<UserResponseDto | null> {
    return this.userRepository.findUserById(id);
  }

  async findUserByEmail(email: string): Promise<UserResponseDto | null> {
    return this.userRepository.findUserByEmail(email);
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = {
      ...createUserDto,
      role: createUserDto.role || USER_ROLE.USER,
    };

    return this.userRepository.createUser(newUser);
  }

  async updateUserById(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto | null> {
    return this.userRepository.updateUserById(id, updateUserDto);
  }

  async deleteUserById(id: string): Promise<boolean> {
    return this.userRepository.deleteUserById(id);
  }

  async getCurrentUser(id: string): Promise<UserResponseDto | null> {
    return this.findUserById(id);
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
