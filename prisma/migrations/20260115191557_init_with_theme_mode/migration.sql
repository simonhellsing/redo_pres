-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Presentation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#3B82F6',
    "themeMode" TEXT NOT NULL DEFAULT 'dark',
    "customerCompanyName" TEXT NOT NULL,
    "customerLogoUrl" TEXT,
    "presentationTitle" TEXT NOT NULL DEFAULT 'Financial Update 2025',
    "financialData" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Presentation" ("companyName", "createdAt", "customerCompanyName", "customerLogoUrl", "financialData", "id", "logoUrl", "presentationTitle", "primaryColor", "updatedAt") SELECT "companyName", "createdAt", "customerCompanyName", "customerLogoUrl", "financialData", "id", "logoUrl", "presentationTitle", "primaryColor", "updatedAt" FROM "Presentation";
DROP TABLE "Presentation";
ALTER TABLE "new_Presentation" RENAME TO "Presentation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
