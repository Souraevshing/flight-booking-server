import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from 'src/shared/jwt.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FlightsController } from './flights/flights.controller';
import { FlightsModule } from './flights/flights.module';
import { FlightsService } from './flights/flights.service';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule,
    UserModule,
    FlightsModule,
  ],
  controllers: [AppController, FlightsController, AuthController],
  providers: [AppService, FlightsService, AuthService],
})
export class AppModule {}
