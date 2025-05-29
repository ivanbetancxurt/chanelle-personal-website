-- AlterTable
ALTER TABLE "Articles" RENAME CONSTRAINT "Article_pkey" TO "Articles_pkey";

-- CreateTable
CREATE TABLE "Bio" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Bio_pkey" PRIMARY KEY ("id")
);
