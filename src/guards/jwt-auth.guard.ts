/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/users/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    let token = req.cookies['access_token'];

    if (!token) {
      token = req.headers.authorization?.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedException('No token exist');
    }

    try {
      const verified = await this.jwtService.verifyAsync(token);
      const email = verified.user_metadata.email;
      const emailVerified = verified.user_metadata.email_verified;
      const id = verified.sub;
      const full_name = verified.user_metadata.full_name;

      if (!emailVerified) {
        throw new UnauthorizedException('Email not verified');
      }

      const user = await this.userService.findUserByEmail(email);

      req['user'] = {
        id: user?.id,
        email: user?.email,
        full_name: user?.full_name,
        role: user?.role,
      };

      return true;
    } catch (error) {
      console.error(
        'Something went wrong:',
        error.response?.data || error.message,
      );
      throw new UnauthorizedException('Invalid authentication token');
    }
  }
}
