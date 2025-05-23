-- CreateTable
CREATE TABLE "Articles" (
    "link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "thumbnailDescription" TEXT NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("link")
);
