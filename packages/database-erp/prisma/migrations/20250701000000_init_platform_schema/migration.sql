-- CreateTable
CREATE TABLE "platform_schema_metadata" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '0.1.0',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_schema_metadata_pkey" PRIMARY KEY ("id")
);
