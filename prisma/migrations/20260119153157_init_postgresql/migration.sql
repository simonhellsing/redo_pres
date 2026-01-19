-- CreateTable
CREATE TABLE "Presentation" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#3B82F6',
    "themeMode" TEXT NOT NULL DEFAULT 'dark',
    "customerCompanyName" TEXT NOT NULL,
    "customerLogoUrl" TEXT,
    "presentationTitle" TEXT NOT NULL DEFAULT 'Financial Update 2025',
    "financialData" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Presentation_pkey" PRIMARY KEY ("id")
);
