import { Module } from '@nestjs/common';
import { FilmesModule } from './filmes/filmes.module';

@Module({
  imports: [FilmesModule],
})
export class AppModule {}
