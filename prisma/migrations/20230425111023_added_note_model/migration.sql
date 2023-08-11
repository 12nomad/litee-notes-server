-- CreateTable
CREATE TABLE "notes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "ownerId" INTEGER NOT NULL,
    "boardId" INTEGER NOT NULL,
    "queueId" INTEGER NOT NULL,
    CONSTRAINT "notes_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "notes_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "notes_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "queues" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "notes_title_key" ON "notes"("title");
