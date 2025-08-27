import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API de Filmes')
    .setDescription('CRUD de Filmes com NestJS, Prisma e PostgreSQL')
    .setVersion('1.0')
  .addTag('users') // Tag opcional para categorizar as rotas
  .addBearerAuth({ // Esquema jwt Bearer
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header'
  }) 

  .build(); // Construir a configuração
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

   app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Remova propriedades não decoradas no DTO
        forbidNonWhitelisted: true, // Retorna erro se enviar propriedades não permetidas
        transform: true, // Transforma os tipos automaticamente EX:( string -> number )
      })
    )


  await app.listen(process.env.API_PORT ?? 3001);
}

bootstrap();
