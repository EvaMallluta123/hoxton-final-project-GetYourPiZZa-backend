/*
  Warnings:

  - You are about to drop the column `varientId` on the `Pizza` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pizza" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "prices" INTEGER NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Pizza" ("description", "id", "image", "prices", "title", "type") SELECT "description", "id", "image", "prices", "title", "type" FROM "Pizza";
DROP TABLE "Pizza";
ALTER TABLE "new_Pizza" RENAME TO "Pizza";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
