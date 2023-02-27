/*
  Warnings:

  - A unique constraint covering the columns `[postInteractionId]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postInteractionId` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "postInteractionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PostInteraction" (
    "id" TEXT NOT NULL,
    "karma" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PostInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "commentKarma" INTEGER NOT NULL DEFAULT 0,
    "parentCommentId" TEXT,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postInteractionId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_postInteractionId_key" ON "Asset"("postInteractionId");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_postInteractionId_fkey" FOREIGN KEY ("postInteractionId") REFERENCES "PostInteraction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postInteractionId_fkey" FOREIGN KEY ("postInteractionId") REFERENCES "PostInteraction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
