import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from 'src/shared/jwt.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { FlightsService } from './flights/flights.service';
import { FlightsController } from './flights/flights.controller';
import { FlightsModule } from './flights/flights.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), JwtModule, UserModule, FlightsModule],
  controllers: [AppController, FlightsController],
  providers: [AppService, FlightsService],
})
export class AppModule {}
