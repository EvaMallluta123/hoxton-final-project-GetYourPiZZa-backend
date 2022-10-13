/*
  Warnings:

  - Added the required column `img1` to the `About` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img2` to the `About` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img3` to the `About` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_About" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mission" TEXT NOT NULL,
    "manifesto" TEXT NOT NULL,
    "img1" TEXT NOT NULL,
    "img2" TEXT NOT NULL,
    "img3" TEXT NOT NULL
);
INSERT INTO "new_About" ("id", "manifesto", "mission") SELECT "id", "manifesto", "mission" FROM "About";
DROP TABLE "About";
ALTER TABLE "new_About" RENAME TO "About";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
