import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { generateBookingId, mockBookings } from 'src/data/mock-booking';
import { hashData } from 'src/utils/hashSecureData';
import { BookingDto } from './dtos/booking.dto';
import { FlightSearchDto } from './dtos/flight-search.dto';
import { FlightDto } from './dtos/flight.dto';
import { Flight } from './flight-types';
import { BookingStatus, SortOption, TripType } from './flights';

@Injectable()
export class FlightsRepository {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') || '',
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || '',
    );
  }
  private readonly bookings: BookingDto[] = mockBookings;
  private bookingId = 1;

  async findAllFlights(filters?: FlightSearchDto): Promise<Flight[]> {
    const query = this.supabase.from('flights').select('*');

    if (filters?.useFilter !== false && filters?.from) {
      query.eq('departure_airport', filters.from);
    }

    if (filters?.useFilter !== false && filters?.to) {
      query.eq('arrival_airport', filters.to);
    }

    const { data, error } = await query;

    if (error) {
      throw new HttpException(
        `Error fetching flights: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return data;
  }

  async createBooking(
    flightDto: FlightDto,
    userId: string,
  ): Promise<BookingDto> {
    const bookingId = generateBookingId(this.bookingId++);

    const { data: outboundFlight, error: outboundError } = await this.supabase
      .from('flights')
      .select('*')
      .eq('id', flightDto.flightId)
      .single();

    if (outboundError) {
      throw new HttpException(
        `Error fetching flight details: ${outboundError.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    let returnFlight: any = null;
    if (flightDto.tripType === TripType.RoundTrip && flightDto.returnDate) {
      const { data: returnFlights, error: returnError } = await this.supabase
        .from('flights')
        .select('*')
        .eq('departure_airport', flightDto.to)
        .eq('arrival_airport', flightDto.from)
        .single();

      if (!returnError) {
        returnFlight = returnFlights;
      }
    }

    const basePrice = outboundFlight.price;
    const returnPrice = returnFlight ? returnFlight.price : 0;
    const totalPrice = (basePrice + returnPrice) * flightDto.passengers;

    let paymentDetails: any = null;
    if (flightDto.paymentDetails) {
      // Hash the CVV before storing
      paymentDetails = { ...flightDto.paymentDetails };
      if (paymentDetails.cvv) {
        paymentDetails.cvv = hashData(paymentDetails.cvv);
      }
    }

    const bookingRecord = {
      id: crypto.randomUUID(),
      booking_id: bookingId,
      user_id: userId,
      flight_id: outboundFlight.id,
      booking_date: new Date().toISOString(),
      departure_date: flightDto.departureDate,
      total_price: totalPrice,
      from: flightDto.from,
      to: flightDto.to,
      departure_time: outboundFlight.departure_time,
      arrival_time: outboundFlight.arrival_time,
      duration: outboundFlight.duration,
      stops: outboundFlight.stops,
      airline: outboundFlight.airline,
      flight_number: outboundFlight.flight_number,
      cabin_class: flightDto.cabinClass,
      trip_type: flightDto.tripType,
      passengers: flightDto.passengers,
      price: basePrice,
      created_at: new Date().toISOString(),
      status: BookingStatus.Confirmed,
      passenger_details: flightDto.passengerDetails || [],
      flight_details: outboundFlight,
      payment_details: paymentDetails,
      return_flight_id: returnFlight ? returnFlight.id : null,
      return_departure_date: flightDto.returnDate || null,
      return_departure_time: returnFlight ? returnFlight.departure_time : null,
      return_arrival_time: returnFlight ? returnFlight.arrival_time : null,
    };

    const { data, error } = await this.supabase
      .from('bookings')
      .insert([bookingRecord])
      .select()
      .single();

    if (error) {
      throw new HttpException(
        `Error creating booking: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return data;
  }

  async findUserBookingById(userId: string): Promise<BookingDto[]> {
    try {
      const { data, error } = await this.supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw new HttpException(
          `Error fetching user bookings: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return data;
    } catch (error) {
      return this.bookings.filter((booking) => booking.userId === userId);
    }
  }

  async getBookingsByUserId(userId: string): Promise<BookingDto[]> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      if (error.code === 'PGRST116') {
        return [] as unknown as Promise<BookingDto[]>;
      }
      throw new HttpException(
        `Error fetching booking: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return data;
  }

  async getOriginCities(): Promise<string[]> {
    const { data, error } = await this.supabase.from('cities').select('*');
    if (error) {
      throw new HttpException(
        `Error fetching origin cities: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return data.map((city) => city.name);
  }

  async getDestinationCities(): Promise<string[]> {
    const { data, error } = await this.supabase.from('cities').select('*');
    if (error) {
      throw new HttpException(
        `Error fetching destination cities: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return data.map((city) => city.name);
  }

  private sortFlights(flightsToSort: Flight[], sortBy: string): Flight[] {
    const sortedFlights = [...flightsToSort];

    switch (sortBy) {
      case SortOption.PriceLowToHigh:
        return sortedFlights.sort((a, b) => a.price - b.price);
      case SortOption.PriceHighToLow:
        return sortedFlights.sort((a, b) => b.price - a.price);
      case SortOption.DurationShortToLong:
        return sortedFlights.sort(
          (a, b) => (a.durationMinutes || 0) - (b.durationMinutes || 0),
        );
      case SortOption.DepartureSoonToLate:
        return sortedFlights.sort((a, b) =>
          (a.departureTime || '').localeCompare(b.departureTime || ''),
        );
      case SortOption.DepartureLateToSoon:
        return sortedFlights.sort((a, b) =>
          (b.departureTime || '').localeCompare(a.departureTime || ''),
        );
      default:
        return sortedFlights;
    }
  }
}
