/*
  Warnings:

  - Added the required column `userId` to the `AssetDownload` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accessKeyId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "AssetDownload" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessKeyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AccessKey" (
    "id" TEXT NOT NULL,
    "keyValue" TEXT NOT NULL,
    "expiresOn" TIMESTAMP(3),

    CONSTRAINT "AccessKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccessKey_keyValue_key" ON "AccessKey"("keyValue");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accessKeyId_fkey" FOREIGN KEY ("accessKeyId") REFERENCES "AccessKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetDownload" ADD CONSTRAINT "AssetDownload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
