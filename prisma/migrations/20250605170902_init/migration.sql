-- CreateTable
CREATE TABLE "Evento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participante" TEXT NOT NULL,
    "comentario" TEXT NOT NULL,
    "sentimento" TEXT NOT NULL,
    "dataEnvio" TEXT NOT NULL,
    "eventoId" INTEGER NOT NULL,
    CONSTRAINT "Feedback_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
