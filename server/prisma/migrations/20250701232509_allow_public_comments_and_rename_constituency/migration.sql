/*
  Warnings:

  - You are about to drop the column `constituency` on the `projects` table. All the data in the column will be lost.
  - Added the required column `subCounty` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
-- First add the new column
ALTER TABLE "projects" ADD COLUMN "subCounty" TEXT;

-- Copy data from constituency to subCounty
UPDATE "projects" SET "subCounty" = "constituency";

-- Make subCounty NOT NULL
ALTER TABLE "projects" ALTER COLUMN "subCounty" SET NOT NULL;

-- Drop the old column
ALTER TABLE "projects" DROP COLUMN "constituency";
