-- CreateTable
CREATE TABLE "Engine" (
    "id" TEXT NOT NULL,
    "assetEngine" TEXT NOT NULL,
    "engineAssetTags" TEXT[],

    CONSTRAINT "Engine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Engine_assetEngine_key" ON "Engine"("assetEngine");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_assetEngine_fkey" FOREIGN KEY ("assetEngine") REFERENCES "Engine"("assetEngine") ON DELETE RESTRICT ON UPDATE CASCADE;
