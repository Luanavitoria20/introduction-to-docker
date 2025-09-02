import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum } from 'class-validator';

export enum Genero {
  ACAO = 'ACAO',
  COMEDIA = 'COMEDIA',
  DRAMA = 'DRAMA',
  TERROR = 'TERROR',
  FICCAO = 'FICCAO',
  AVENTURA = 'AVENTURA',
}

export class CreateFilmeDto {
  @ApiProperty({
    example: 'Vingadores: Ultimato',
    description: 'Título do filme'
  })
  @IsString()
  titulo: string;

  @ApiProperty({
    example: 'ACAO',
    description: 'Gênero do filme',
    enum: Genero
  })
  @IsEnum(Genero)
  genero: Genero;

  @ApiProperty({
    example: 2019,
    description: 'Ano de lançamento'
  })
  @IsNumber()
  ano: number;
}
