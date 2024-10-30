/*
  Warnings:

  - The `countryCode` column on the `Contact` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `countryCode` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CountryCode" AS ENUM ('INDIA_91', 'PAKISTAN_92', 'AFGHANISTAN_93', 'BANGLADESH_94', 'SRI_LANKA_95', 'NEPAL_96', 'BHUTAN_97', 'MALDIVES_98', 'MYANMAR_99', 'THAILAND_100');

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "countryCode",
ADD COLUMN     "countryCode" "CountryCode";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "countryCode",
ADD COLUMN     "countryCode" "CountryCode";
