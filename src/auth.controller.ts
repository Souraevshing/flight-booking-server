import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dtos/user.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Generate Access Token' })
  @ApiResponse({
    status: 200,
    description: 'Access token generated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('generate-token')
  async generateAccessToken(@Body() createUserDto: CreateUserDto) {
    const token = await this.authService.generateToken(createUserDto.email);
    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { access_token: token };
  }
}
