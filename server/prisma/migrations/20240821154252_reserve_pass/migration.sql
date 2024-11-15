/*
  Warnings:

  - Made the column `reservePass` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "reservePass" SET NOT NULL;
