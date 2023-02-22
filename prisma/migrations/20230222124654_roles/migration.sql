-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userKarma" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userRoles" TEXT[] DEFAULT ARRAY['User']::TEXT[];
