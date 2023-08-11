/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "users_username_key";

-- DropIndex
DROP INDEX "users_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "users";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "teams" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_boards" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "boards_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "teams" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_boards" ("createdAt", "id", "ownerId", "title", "updatedAt") SELECT "createdAt", "id", "ownerId", "title", "updatedAt" FROM "boards";
DROP TABLE "boards";
ALTER TABLE "new_boards" RENAME TO "boards";
CREATE UNIQUE INDEX "boards_title_key" ON "boards"("title");
CREATE TABLE "new_notes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "ownerId" INTEGER NOT NULL,
    "boardId" INTEGER NOT NULL,
    "queueId" INTEGER NOT NULL,
    CONSTRAINT "notes_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "teams" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "notes_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "notes_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "queues" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_notes" ("boardId", "content", "createdAt", "id", "ownerId", "queueId", "title", "updatedAt") SELECT "boardId", "content", "createdAt", "id", "ownerId", "queueId", "title", "updatedAt" FROM "notes";
DROP TABLE "notes";
ALTER TABLE "new_notes" RENAME TO "notes";
CREATE UNIQUE INDEX "notes_title_key" ON "notes"("title");
CREATE TABLE "new_queues" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "boardId" INTEGER NOT NULL,
    CONSTRAINT "queues_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "teams" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "queues_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_queues" ("boardId", "createdAt", "id", "ownerId", "title", "updatedAt") SELECT "boardId", "createdAt", "id", "ownerId", "title", "updatedAt" FROM "queues";
DROP TABLE "queues";
ALTER TABLE "new_queues" RENAME TO "queues";
CREATE UNIQUE INDEX "queues_title_key" ON "queues"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");
