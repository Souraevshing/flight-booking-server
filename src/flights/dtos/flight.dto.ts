import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CabinClass, TripType } from '../flights';

class PassengerDetailsDto {
  @ApiProperty({ description: 'Full name of the passenger' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Phone number of the passenger' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'ID number or passport number of the passenger' })
  @IsString()
  idNumber: string;
}

class PaymentDetailsDto {
  @ApiProperty({
    description: 'Credit card number',
    example: '4111111111111111',
  })
  @IsString()
  cardNumber: string;

  @ApiProperty({ description: 'Card expiry date', example: '12/25' })
  @IsString()
  expiryDate: string;

  @ApiProperty({ description: 'CVV security code', example: '123' })
  @IsString()
  cvv: string;

  @ApiProperty({ description: 'Name as it appears on the card' })
  @IsString()
  nameOnCard: string;
}

export class FlightDto {
  @ApiProperty({
    description: 'Date of departure',
    example: '2023-12-25T10:30:00Z',
  })
  @IsDateString()
  departureDate: string;

  @ApiProperty({
    description: 'Date of return for round trips',
    example: '2023-12-31T14:45:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @ApiProperty({
    description: 'Departure city or airport code',
    example: 'NYC',
  })
  @IsString()
  from: string;

  @ApiProperty({
    description: 'Destination city or airport code',
    example: 'LAX',
  })
  @IsString()
  to: string;

  @ApiProperty({ description: 'Number of passengers for booking', example: 2 })
  @IsNumber()
  passengers: number;

  @ApiProperty({
    description: 'Cabin class selection',
    enum: CabinClass,
    example: 'ECONOMY',
  })
  @IsEnum(CabinClass, { message: 'Invalid cabin class' })
  cabinClass?: CabinClass | string;

  @ApiProperty({
    description: 'Type of trip',
    enum: TripType,
    example: 'ROUND_TRIP',
  })
  @IsEnum(TripType, { message: 'Invalid trip type' })
  tripType?: TripType | string;

  @ApiProperty({
    description: 'Flight ID for booking reference',
    required: false,
  })
  @IsString()
  flightId?: string;

  @ApiProperty({
    description: 'Details of all passengers',
    type: [PassengerDetailsDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PassengerDetailsDto)
  passengerDetails?: PassengerDetailsDto[];

  @ApiProperty({
    description: 'Payment details for the booking',
    type: PaymentDetailsDto,
    required: false,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails?: PaymentDetailsDto;
}
