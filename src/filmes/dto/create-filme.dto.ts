import { ApiProperty } from '@nestjs/swagger';

export class CreateFilmeDto {
  @ApiProperty({
    example: 'Vingadores: Ultimato',
    description: 'Título do filme'
  })
  titulo: string;

  @ApiProperty({
    example: 'ACAO', description: 'Gênero do filme'
  })
  genero: 'ACAO' | 'COMEDIA' | 'DRAMA' |
    'TERROR' | 'FICCAO' | 'AVENTURA';

  @ApiProperty({
    example: 2019,
    description: 'Ano de lançamento'
  })
  ano: number;
}
