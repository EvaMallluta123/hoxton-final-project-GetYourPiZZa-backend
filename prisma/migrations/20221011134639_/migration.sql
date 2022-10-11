/*
  Warnings:

  - Added the required column `varients` to the `Varients` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Varients" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "varients" TEXT NOT NULL
);
INSERT INTO "new_Varients" ("id") SELECT "id" FROM "Varients";
DROP TABLE "Varients";
ALTER TABLE "new_Varients" RENAME TO "Varients";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
