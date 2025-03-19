import { Module } from '@nestjs/common';
import { JwtModule } from 'src/shared/jwt.module';
import { UserModule } from 'src/users/user.module';
import { FlightsController } from './flights.controller';
import { FlightsRepository } from './flights.repository';
import { FlightsService } from './flights.service';

@Module({
  imports: [JwtModule, UserModule],
  providers: [FlightsRepository, FlightsService],
  controllers: [FlightsController],
  exports: [FlightsService, FlightsRepository],
})
export class FlightsModule {}
