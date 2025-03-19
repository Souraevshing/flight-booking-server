import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { USER_ROLE } from '../users-types';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address',
    default: '',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'First Name',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last Name',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'User role',
    enum: USER_ROLE,
    required: false,
    default: 'user',
  })
  @IsOptional()
  @IsEnum(USER_ROLE)
  role?: USER_ROLE;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'First Name',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Last Name',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'User role',
    enum: USER_ROLE,
    required: false,
    default: 'user',
  })
  @IsOptional()
  @IsEnum(USER_ROLE)
  role?: USER_ROLE;
}

export class UserResponseDto {
  @ApiProperty({ description: 'User id' })
  id: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'Full Name' })
  full_name: string;

  @ApiProperty({ description: 'User role', enum: USER_ROLE })
  role: string;

  @ApiProperty({ description: 'User created at' })
  createdAt: Date;

  @ApiProperty({ description: 'User updated at' })
  updatedAt: Date;
}
