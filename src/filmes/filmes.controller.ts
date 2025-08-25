import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, HttpCode } from '@nestjs/common';
import { FilmesService } from './filmes.service';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Filmes')
@Controller('filmes')
export class FilmesController {
  constructor(private readonly filmesService: FilmesService) { }

  @Post()
  @ApiOperation({ summary: 'Criar um novo filme' })
  @ApiResponse({ status: 201, description: 'Filme criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() data: CreateFilmeDto) {
    return this.filmesService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os filmes' })
  @ApiResponse({ status: 200, description: 'Lista de filmes retornada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Filme não encontrado.' })
  findAll() {
    return this.filmesService.findAll();
  }

  @Get(':id')
@ApiOperation({ summary: 'Buscar um filme pelo ID' })
@ApiResponse({ status: 200, description: 'Filme encontrado.' })
@ApiResponse({ status: 404, description: 'Filme não encontrado.' })
async findOne(@Param('id') id: string) {
  const filme = await this.filmesService.findOne(Number(id));
  if (!filme) throw new NotFoundException('Filme não encontrado');
  return filme;
}

@Put(':id')
@ApiOperation({ summary: 'Atualizar um filme pelo ID' })
@ApiResponse({ status: 200, description: 'Filme atualizado com sucesso.' })
@ApiResponse({ status: 404, description: 'Filme não encontrado.' })
@ApiResponse({ status: 400, description: 'Dados inválidos.' })
async update(@Param('id') id: string, @Body() data: CreateFilmeDto) {
  const filme = await this.filmesService.findOne(Number(id));
  if (!filme) throw new NotFoundException('Filme não encontrado');
  return this.filmesService.update(Number(id), data);
}

@Delete(':id')
@HttpCode(204)
@ApiOperation({ summary: 'Deletar um filme pelo ID' })
@ApiResponse({ status: 204, description: 'Filme deletado com sucesso.' })
@ApiResponse({ status: 404, description: 'Filme não encontrado.' })
async remove(@Param('id') id: string) {
  const filme = await this.filmesService.findOne(Number(id));
  if (!filme) throw new NotFoundException('Filme não encontrado');
  return this.filmesService.remove(Number(id));
}

}
