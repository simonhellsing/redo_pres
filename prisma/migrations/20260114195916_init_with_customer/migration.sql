/*
  Warnings:

  - Added the required column `customerCompanyName` to the `Presentation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Presentation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#3B82F6',
    "customerCompanyName" TEXT NOT NULL,
    "customerLogoUrl" TEXT,
    "presentationTitle" TEXT NOT NULL DEFAULT 'Financial Update 2025',
    "financialData" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Presentation" ("companyName", "createdAt", "financialData", "id", "logoUrl", "primaryColor", "updatedAt") SELECT "companyName", "createdAt", "financialData", "id", "logoUrl", "primaryColor", "updatedAt" FROM "Presentation";
DROP TABLE "Presentation";
ALTER TABLE "new_Presentation" RENAME TO "Presentation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
