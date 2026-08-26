-- AlterEnum
BEGIN;
CREATE TYPE "ActivityEventType_new" AS ENUM ('LOGGED_EXPERIENCE', 'FOLLOWED_USER');
ALTER TABLE "ActivityEvent" ALTER COLUMN "eventType" TYPE "ActivityEventType_new" USING ("eventType"::text::"ActivityEventType_new");
ALTER TYPE "ActivityEventType" RENAME TO "ActivityEventType_old";
ALTER TYPE "ActivityEventType_new" RENAME TO "ActivityEventType";
DROP TYPE "ActivityEventType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "LibraryEntry" DROP CONSTRAINT "LibraryEntry_userId_fkey";

-- DropForeignKey
ALTER TABLE "LibraryEntry" DROP CONSTRAINT "LibraryEntry_mediaItemId_fkey";

-- DropForeignKey
ALTER TABLE "DiaryEntry" DROP CONSTRAINT "DiaryEntry_userId_fkey";

-- DropForeignKey
ALTER TABLE "DiaryEntry" DROP CONSTRAINT "DiaryEntry_mediaItemId_fkey";

-- DropForeignKey
ALTER TABLE "MediaList" DROP CONSTRAINT "MediaList_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "MediaListItem" DROP CONSTRAINT "MediaListItem_mediaListId_fkey";

-- DropForeignKey
ALTER TABLE "MediaListItem" DROP CONSTRAINT "MediaListItem_mediaItemId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_diaryEntryId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_diaryEntryId_fkey";

-- DropForeignKey
ALTER TABLE "ImportJob" DROP CONSTRAINT "ImportJob_userId_fkey";

-- DropIndex
DROP INDEX "Comment_diaryEntryId_idx";

-- AlterTable
ALTER TABLE "ActivityEvent" DROP COLUMN "diaryEntryId",
DROP COLUMN "mediaItemId",
DROP COLUMN "mediaListId",
ADD COLUMN     "experienceId" TEXT;

-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
DROP COLUMN "diaryEntryId",
ADD COLUMN     "experienceId" TEXT NOT NULL,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("userId", "experienceId");

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "diaryEntryId",
ADD COLUMN     "experienceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "MediaItem";

-- DropTable
DROP TABLE "LibraryEntry";

-- DropTable
DROP TABLE "DiaryEntry";

-- DropTable
DROP TABLE "MediaList";

-- DropTable
DROP TABLE "MediaListItem";

-- DropTable
DROP TABLE "ImportJob";

-- DropEnum
DROP TYPE "MediaType";

-- DropEnum
DROP TYPE "ExternalSource";

-- DropEnum
DROP TYPE "LibraryStatus";

-- DropEnum
DROP TYPE "ImportSourcePlatform";

-- DropEnum
DROP TYPE "ImportJobStatus";

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "experiencedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperiencePhoto" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ExperiencePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Experience_userId_experiencedAt_idx" ON "Experience"("userId", "experiencedAt");

-- CreateIndex
CREATE INDEX "ExperiencePhoto_experienceId_idx" ON "ExperiencePhoto"("experienceId");

-- CreateIndex
CREATE INDEX "Comment_experienceId_idx" ON "Comment"("experienceId");

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperiencePhoto" ADD CONSTRAINT "ExperiencePhoto_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

