import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async generateToken(email: string): Promise<string> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = {
      sub: user.id,
      user_metadata: {
        email: user.email,
        email_verified: true,
        full_name: user.full_name,
      },
    };

    return this.jwtService.sign(payload);
  }
}
