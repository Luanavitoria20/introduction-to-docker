import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilmesService {
  constructor(private prisma: PrismaService) {}

  async create(data) {
    return this.prisma.filme.create({ data });
  }

  async findAll() {
    return this.prisma.filme.findMany();
  }

  async findOne(id: number) {
    const filme = await this.prisma.filme.findUnique({ where: { id } });
    if (!filme) throw new NotFoundException('Filme não encontrado');
    return filme;
  }

  async update(id: number, data) {
    await this.findOne(id);
    return this.prisma.filme.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.filme.delete({ where: { id } });
  }
}
