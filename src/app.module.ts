import { Module } from '@nestjs/common';
import { FilmesModule } from './filmes/filmes.module';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [FilmesModule, UserModule, AuthModule],
})
export class AppModule { }
