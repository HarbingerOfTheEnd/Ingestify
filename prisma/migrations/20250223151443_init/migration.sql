-- CreateTable
CREATE TABLE "EmailIngestionConfig" (
    "id" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "connectionType" TEXT NOT NULL,
    "host" TEXT,
    "port" INTEGER,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailIngestionConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PDFMetadata" (
    "id" TEXT NOT NULL,
    "emailConfigId" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "dateReceived" TIMESTAMP(3) NOT NULL,
    "subject" TEXT NOT NULL,
    "attachmentFileName" TEXT NOT NULL,
    "storedFilePath" TEXT NOT NULL,

    CONSTRAINT "PDFMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailIngestionConfig_emailAddress_key" ON "EmailIngestionConfig"("emailAddress");

-- AddForeignKey
ALTER TABLE "PDFMetadata" ADD CONSTRAINT "PDFMetadata_emailConfigId_fkey" FOREIGN KEY ("emailConfigId") REFERENCES "EmailIngestionConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
