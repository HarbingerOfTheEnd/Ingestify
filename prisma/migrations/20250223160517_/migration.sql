/*
  Warnings:

  - You are about to drop the `EmailIngestionConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PDFMetadata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PDFMetadata" DROP CONSTRAINT "PDFMetadata_emailConfigId_fkey";

-- DropTable
DROP TABLE "EmailIngestionConfig";

-- DropTable
DROP TABLE "PDFMetadata";

-- CreateTable
CREATE TABLE "EmailConfig" (
    "id" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "connectionType" TEXT NOT NULL,
    "host" TEXT,
    "port" INTEGER,
    "username" TEXT,
    "password" TEXT,
    "accessToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailMetadata" (
    "id" TEXT NOT NULL,
    "emailConfigId" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "dateReceived" TIMESTAMP(3) NOT NULL,
    "subject" TEXT NOT NULL,
    "attachmentFileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,

    CONSTRAINT "EmailMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailConfig_emailAddress_key" ON "EmailConfig"("emailAddress");

-- AddForeignKey
ALTER TABLE "EmailMetadata" ADD CONSTRAINT "EmailMetadata_emailConfigId_fkey" FOREIGN KEY ("emailConfigId") REFERENCES "EmailConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
