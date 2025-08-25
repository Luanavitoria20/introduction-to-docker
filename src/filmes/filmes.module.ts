import { Module } from '@nestjs/common';
import { FilmesController } from './FilmesController';
import { FilmesService } from './filmes.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FilmesController],
  providers: [FilmesService],
})
export class FilmesModule { }
