/*
  Warnings:

  - You are about to drop the `log` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "log" DROP CONSTRAINT "log_authorId_fkey";

-- DropTable
DROP TABLE "log";

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "product" JSONB NOT NULL,
    "order" JSONB NOT NULL,
    "user" JSONB NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
