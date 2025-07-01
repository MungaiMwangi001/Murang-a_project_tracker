/*
  Warnings:

  - You are about to drop the column `dueDate` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `projects` table. All the data in the column will be lost.
  - Added the required column `userName` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountPaidToDate` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budgetedCost` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `constituency` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractCost` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractEndDate` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractName` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractNumber` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractPeriod` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractStartDate` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractor` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `directorate` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `financialYear` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `implementationStatus` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastUpdated` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lpoNumber` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pmc` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `progress` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendations` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceOfFunds` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ward` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `projects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "dueDate",
DROP COLUMN "priority",
ADD COLUMN     "amountPaidToDate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "budgetedCost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "constituency" TEXT NOT NULL,
ADD COLUMN     "contractCost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "contractEndDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "contractName" TEXT NOT NULL,
ADD COLUMN     "contractNumber" TEXT NOT NULL,
ADD COLUMN     "contractPeriod" TEXT NOT NULL,
ADD COLUMN     "contractStartDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "contractor" TEXT NOT NULL,
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "directorate" TEXT NOT NULL,
ADD COLUMN     "financialYear" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "implementationStatus" TEXT NOT NULL,
ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "lpoNumber" TEXT NOT NULL,
ADD COLUMN     "pmc" TEXT NOT NULL,
ADD COLUMN     "progress" INTEGER NOT NULL,
ADD COLUMN     "recommendations" TEXT NOT NULL,
ADD COLUMN     "sourceOfFunds" TEXT NOT NULL,
ADD COLUMN     "ward" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
