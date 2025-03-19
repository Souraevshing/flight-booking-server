import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthMiddleware } from 'src/middlewares/auth-user';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dtos/user.dto';
import { UserPayload } from './user-payload';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns current user',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('user/profile')
  async getCurrentUser(@Req() req: Request) {
    const currentUser = req['user'] as UserPayload;

    if (!currentUser?.id) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userService.findUserById(currentUser.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns all users',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
  })
  @ApiResponse({ status: 403, description: 'Forbidden user' })
  @ApiBearerAuth('jwt')
  @UseGuards(AuthMiddleware)
  @Get('users')
  async findAllUsers() {
    return this.userService.findAllUsers();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with id',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user',
  })
  @ApiResponse({ status: 403, description: 'Forbidden user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'ID of the user to retrieve' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findUserById(@Param('id') id: string, @Req() req: Request) {
    const currentUser = req['user'] as UserPayload;

    if (currentUser.id !== id && currentUser.role !== 'admin') {
      throw new ForbiddenException('Only admin access');
    }

    const user = await this.userService.findUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @ApiOperation({ summary: 'Get user by ID (Admin or own user only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with the specified ID',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user',
  })
  @ApiResponse({ status: 403, description: 'Forbidden user' })
  @UseGuards(AuthMiddleware)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const isUserExist = await this.userService.findUserByEmail(
      createUserDto.email,
    );

    if (isUserExist) {
      throw new ConflictException('User already exist');
    }

    return this.userService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user',
  })
  @ApiResponse({ status: 403, description: 'Forbidden user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'User to be updated' })
  @ApiBody({ type: UpdateUserDto })
  @ApiBearerAuth('jwt')
  @UseGuards(AuthMiddleware)
  @Put(':id')
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const currentUser = req['user'] as UserPayload;
    const userType = currentUser.role === 'admin';

    if (currentUser.id !== id && userType) {
      throw new ForbiddenException('Unable to access other user profile');
    }

    if (!userType && updateUserDto.role) {
      throw new ForbiddenException('Cannot update user role');
    }

    const updatedUser = await this.userService.updateUserById(
      id,
      updateUserDto,
    );
    if (!updateUserDto) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 204,
    description: 'User deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user',
  })
  @ApiResponse({ status: 403, description: 'Forbidden user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'User to be deleted' })
  @ApiBearerAuth('jwt')
  @UseGuards(AuthMiddleware)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    const isUserExist = await this.userService.findUserById(id);

    if (!isUserExist) {
      throw new NotFoundException('User not found');
    }

    return await this.userService.deleteUserById(id);
  }
}
