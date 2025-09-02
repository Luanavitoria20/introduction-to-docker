import { Controller, Post, Body, Get, Param, NotFoundException, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { FilmesService } from './filmes.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ComumGuard } from '../auth/comum.guard';
import { AdminGuard } from '../auth/admin.guard';


@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Filmes')
@Controller('filmes')
export class FilmesController {
    constructor(private readonly filmesService: FilmesService) { }


    @UseGuards(AdminGuard)
    @Post()
    @ApiOperation({ summary: 'Criar um novo filme' })
    @ApiResponse({ status: 201, description: 'Filme criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    create(@Body() data: CreateFilmeDto) {
        return this.filmesService.create(data);
    }

    @UseGuards(ComumGuard)
    @Get()
    @ApiOperation({ summary: 'Listar todos os filmes' })
    @ApiResponse({ status: 200, description: 'Lista de filmes retornada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Filme não encontrado.' })
    findAll() {
        return this.filmesService.findAll();
    }


    @UseGuards(ComumGuard)
    @Get(':id')

    @ApiOperation({ summary: 'Buscar um filme pelo ID' })
    @ApiResponse({ status: 200, description: 'Filme encontrado.' })
    @ApiResponse({ status: 404, description: 'Filme não encontrado.' })
    async findOne(@Param('id') id: string) {
        const filme = await this.filmesService.findOne(Number(id));
        if (!filme) {
            throw new NotFoundException('Filme não encontrado');
        }
        return filme;
    }

    @UseGuards(AdminGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Atualizar um filme pelo ID' })
    @ApiResponse({ status: 200, description: 'Filme atualizado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Filme não encontrado.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    async update(@Param('id') id: string, @Body() data: CreateFilmeDto) {
        const filme = await this.filmesService.findOne(Number(id));
        if (!filme) {
            throw new NotFoundException('Filme não encontrado');
        }
        return this.filmesService.update(Number(id), data);
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Deletar um filme pelo ID' })
    @ApiResponse({ status: 204, description: 'Filme deletado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Filme não encontrado.' })
    async remove(@Param('id') id: string) {
        const filme = await this.filmesService.findOne(Number(id));
        if (!filme) {
            throw new NotFoundException('Filme não encontrado');
        }
        return this.filmesService.remove(Number(id));
    }

}
