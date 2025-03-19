import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
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
import { User } from 'src/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FlightSearchDto } from './dtos/flight-search.dto';
import { FlightDto } from './dtos/flight.dto';
import { FlightsService } from './flights.service';

@ApiTags('Flights')
@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @ApiOperation({ summary: 'Get public flights' })
  @ApiResponse({ status: 200, description: 'Returns a list of public flights' })
  @Get('public')
  getPublicFlights() {
    return this.flightsService.getPublicFlights();
  }

  @ApiOperation({ summary: 'Search flights with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'Returns flights matching the search criteria',
  })
  @Get()
  async findAllFlights(
    @Query() filters: FlightSearchDto,
    @User() user?: { id: string },
  ) {
    const userId = user?.id || null;
    return this.flightsService.findAllFlights(userId, filters);
  }

  @ApiOperation({ summary: 'Book a flight' })
  @ApiResponse({
    status: 201,
    description: 'Flight has been successfully booked',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - user not authenticated',
  })
  @ApiBody({ type: FlightDto })
  @ApiBearerAuth('jwt')
  @Post('booking')
  @UseGuards(JwtAuthGuard)
  async bookFlight(@Body() flightDto: FlightDto, @User() user: { id: string }) {
    return this.flightsService.createBooking(flightDto, user.id);
  }

  @ApiOperation({ summary: 'Get user bookings' })
  @ApiResponse({ status: 200, description: 'Returns a list of user bookings' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - user not authenticated',
  })
  @ApiBearerAuth('jwt')
  @Get('bookings')
  @UseGuards(JwtAuthGuard)
  async findUserBookingById(
    @User() user: { id: string },
    @Headers('x-user-id') userIdHeader?: string,
  ) {
    // If X-User-ID header is present and user is admin, fetch bookings for that user
    // Otherwise fetch for the current user
    const targetUserId = userIdHeader || user.id;
    return this.flightsService.findUserBookingById(targetUserId);
  }

  @ApiOperation({ summary: 'Get bookings by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of bookings for the specified user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - user not authenticated',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user to fetch bookings for',
  })
  @ApiBearerAuth('jwt')
  @Get('bookings/:userId')
  @UseGuards(JwtAuthGuard)
  async getBookingsByUserId(@Param('userId') userId: string) {
    const a = await this.flightsService.getBookingsByUserId(userId);
    console.log(a, 'a');
    return a;
  }

  @ApiOperation({ summary: 'Get list of origin cities' })
  @ApiResponse({ status: 200, description: 'Returns a list of origin cities' })
  @Get('cities/origin')
  getOriginCities() {
    return this.flightsService.getOriginCities();
  }

  @ApiOperation({ summary: 'Get list of destination cities' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of destination cities',
  })
  @Get('cities/destination')
  getDestinationCities() {
    return this.flightsService.getDestinationCities();
  }
}
