/*
  Warnings:

  - You are about to drop the column `userId` on the `Asset` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_userId_fkey";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "UserAssetDownloads" (
    "id" TEXT NOT NULL,
    "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "UserAssetDownloads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserAssetDownloads" ADD CONSTRAINT "UserAssetDownloads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssetDownloads" ADD CONSTRAINT "UserAssetDownloads_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
