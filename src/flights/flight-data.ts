import { Flight } from '../flights/flight-types';
import { Airline } from './flights';

export const generateMockFlights = (
  from: string,
  to: string,
  date: string,
  count = 10,
): Flight[] => {
  const airlines = [
    { name: Airline.DELTA, logo: 'https://placehold.co/30x30?text=DL' },
    { name: Airline.UNITED, logo: 'https://placehold.co/30x30?text=UA' },
    { name: Airline.AMERICAN, logo: 'https://placehold.co/30x30?text=AA' },
    { name: Airline.SPIRIT, logo: 'https://placehold.co/30x30?text=NK' },
    { name: Airline.JET_BLUE, logo: 'https://placehold.co/30x30?text=B6' },
  ];

  const stopLocations = [
    'ATL',
    'ORD',
    'DFW',
    'DEN',
    'LAX',
    'JFK',
    'MIA',
    'SFO',
    'CLT',
    'LAS',
  ];

  return Array.from({ length: count }, (_, i) => {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const airlineCode = airline.name.slice(0, 2).toUpperCase();
    const flightNumber = `${airlineCode}${
      Math.floor(Math.random() * 1000) + 1000
    }`;
    const durationMinutes = Math.floor(Math.random() * 240) + 60;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    const duration = `${hours}h ${minutes}m`;

    const departureHour = Math.floor(Math.random() * 20) + 4; // 4 AM to 11 PM
    const departureMinute = Math.floor(Math.random() * 60);
    const departureTime = `${departureHour
      .toString()
      .padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}`;

    const arrivalHourRaw =
      departureHour + hours + (departureMinute + minutes >= 60 ? 1 : 0);
    const arrivalHour = arrivalHourRaw % 24;
    const arrivalMinute = (departureMinute + minutes) % 60;
    const arrivalTime = `${arrivalHour
      .toString()
      .padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`;

    const stops = Math.floor(Math.random() * 3);
    const price = Math.floor(Math.random() * 600) + 200;

    return {
      id: `flight-${i}`,
      airline: airline.name,
      airlineCode,
      airlineLogo: airline.logo,
      flightNumber,
      departureAirport: from,
      arrivalAirport: to,
      departureTime,
      arrivalTime,
      departureDate: date,
      duration,
      durationMinutes,
      stops,
      stopLocations: stops > 0 ? stopLocations.slice(0, stops) : [],
      price,
      destination: to,
    };
  });
};
