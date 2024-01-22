/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - The primary key for the `RecipeCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryName` on the `RecipeCategory` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `RecipeCategory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name_pl]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_en]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipeId,categoryId]` on the table `RecipeCategory` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Category` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name_en` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_pl` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `RecipeCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RecipeCategory" DROP CONSTRAINT "RecipeCategory_categoryName_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "name",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "name_pl" TEXT NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RecipeCategory" DROP CONSTRAINT "RecipeCategory_pkey",
DROP COLUMN "categoryName",
DROP COLUMN "id",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_pl_key" ON "Category"("name_pl");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_en_key" ON "Category"("name_en");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeCategory_recipeId_categoryId_key" ON "RecipeCategory"("recipeId", "categoryId");

-- AddForeignKey
ALTER TABLE "RecipeCategory" ADD CONSTRAINT "RecipeCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
