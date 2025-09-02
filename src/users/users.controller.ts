import { Body, Controller, Post, Get, Param, Put, Delete, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { AdminGuard } from "../auth/admin.guard";
import { ComumGuard } from "../auth/comum.guard";


@ApiTags('users')

@UseGuards(JwtAuthGuard)

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(ComumGuard)
  @Post() // Rota Cria Usuário
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso!' })
  @ApiResponse({ status: 409, description: 'E-mail já está em uso!' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor!' })
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }
  
  @UseGuards(AdminGuard)
  @Get() // Lista todos os usuários
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso!'
  })
  findAll() {
    return this.usersService.findAll()
  }

  @UseGuards(ComumGuard)
  @Get(':id')  // Buscar o usuario pelo ID
  @ApiOperation({ summary: 'Buscar um usuário por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado.'
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado.'
  })
  @ApiParam({
    name: 'id', type: String,
    description: 'ID do usuário'
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @UseGuards(AdminGuard)
  @Put(':id') // atualizar um usuário
  @ApiOperation({ summary: 'Atualizar um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso.'
  })
  @ApiParam({
    name: 'id', type: String,
    description: 'ID do usuário'
  })
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: string, @Body() data: any) {
    return this.usersService.update(id, data)
  }

  @UseGuards(AdminGuard)
  @Delete(':id') // remove 
  @ApiOperation({ summary: 'Remover um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário removido com sucesso.'
  })
  @ApiParam({
    name: 'id', type: String,
    description: 'ID do usuário'
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }

}