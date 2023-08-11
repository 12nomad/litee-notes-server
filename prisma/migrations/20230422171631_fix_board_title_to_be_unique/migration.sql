/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `boards` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "boards_title_key" ON "boards"("title");
