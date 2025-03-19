import { Injectable } from '@nestjs/common';
import { indianCities } from 'src/data/mock-cities';
import { publicFlights } from 'src/data/mock-flights';
import { BookingDto } from './dtos/booking.dto';
import { FlightSearchDto } from './dtos/flight-search.dto';
import { FlightDto } from './dtos/flight.dto';
import { Flight } from './flight-types';
import { FlightsRepository } from './flights.repository';

@Injectable()
export class FlightsService {
  constructor(private flightRepository: FlightsRepository) {}

  getOriginCities() {
    return { cities: indianCities };
  }

  getDestinationCities() {
    return { cities: indianCities };
  }

  getPublicFlights(): { flights: Flight[] } {
    return { flights: publicFlights };
  }

  async findAllFlights(
    userId: string | null,
    filters?: FlightSearchDto,
  ): Promise<{ flights: Flight[] }> {
    const flights = await this.flightRepository.findAllFlights(filters);
    return { flights };
  }

  async createBooking(
    flightDto: FlightDto,
    userId: string,
  ): Promise<{ booking: BookingDto }> {
    const booking = await this.flightRepository.createBooking(
      flightDto,
      userId,
    );
    return { booking };
  }

  async findUserBookingById(
    userId: string,
  ): Promise<{ bookings: BookingDto[] }> {
    const bookings = await this.flightRepository.findUserBookingById(userId);
    return { bookings };
  }

  async getBookingsByUserId(userId: string): Promise<BookingDto[]> {
    const booking = await this.flightRepository.getBookingsByUserId(userId);
    return booking;
  }
}
