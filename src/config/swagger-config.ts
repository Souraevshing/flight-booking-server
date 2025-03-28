import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('Book Flights')
  .setDescription('Login and book flights')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'authenticate user with jwt token',
      in: 'header',
    },
    'jwt',
  )
  .build();
