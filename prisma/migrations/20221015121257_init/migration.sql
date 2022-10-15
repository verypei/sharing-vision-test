-- CreateTable
CREATE TABLE "article" (
    "id" SERIAL NOT NULL,
    "Title" VARCHAR(200) NOT NULL,
    "Content" TEXT NOT NULL,
    "Category" VARCHAR(100) NOT NULL,
    "Status" VARCHAR(100) NOT NULL,
    "Created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);
