/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_ownerId_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "ownerId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
