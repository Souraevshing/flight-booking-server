import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as NestJsJwtModule } from '@nestjs/jwt';

import { AuthController } from 'src/auth.controller';
import { AuthService } from 'src/auth.service';
import { AuthMiddleware } from 'src/middlewares/auth-user';
import { UserModule } from 'src/users/user.module';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    UserModule,
    NestJsJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtAuthGuard, AuthMiddleware, AuthService],
  exports: [JwtAuthGuard, AuthMiddleware],
})
export class GuardsModule {}
