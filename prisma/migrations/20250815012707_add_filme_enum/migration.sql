-- CreateEnum
CREATE TYPE "public"."Genero" AS ENUM ('ACAO', 'COMEDIA', 'DRAMA', 'TERROR', 'FICCAO', 'AVENTURA');

-- CreateTable
CREATE TABLE "public"."Filme" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "genero" "public"."Genero" NOT NULL,
    "ano" INTEGER NOT NULL,

    CONSTRAINT "Filme_pkey" PRIMARY KEY ("id")
);
