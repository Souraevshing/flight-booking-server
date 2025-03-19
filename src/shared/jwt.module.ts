import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as NestJsJwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthMiddleware } from 'src/middlewares/auth-user';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    NestJsJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
    }),
    forwardRef(() => UserModule),
  ],
  providers: [JwtAuthGuard, AuthMiddleware],
  exports: [NestJsJwtModule, JwtAuthGuard, AuthMiddleware],
})
export class JwtModule {}
