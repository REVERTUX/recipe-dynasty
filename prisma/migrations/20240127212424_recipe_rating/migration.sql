/*
  Warnings:

  - You are about to drop the column `rating` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "rating";

-- DropTable
DROP TABLE "Review";

-- CreateTable
CREATE TABLE "RecipeRating" (
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "recipeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RecipeRatingAvg" (
    "recipeId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "RecipeRating_recipeId_userId_idx" ON "RecipeRating"("recipeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeRating_recipeId_userId_key" ON "RecipeRating"("recipeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeRatingAvg_recipeId_key" ON "RecipeRatingAvg"("recipeId");

-- CreateIndex
CREATE INDEX "RecipeRatingAvg_recipeId_idx" ON "RecipeRatingAvg"("recipeId");

-- AddForeignKey
ALTER TABLE "RecipeRating" ADD CONSTRAINT "RecipeRating_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeRating" ADD CONSTRAINT "RecipeRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeRatingAvg" ADD CONSTRAINT "RecipeRatingAvg_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create a function to update the average recipe rating
CREATE OR REPLACE FUNCTION update_average_recipe_rating()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Calculate the average rating for the recipe
  UPDATE "RecipeRatingAvg"
  SET value = (
    SELECT AVG(value)
    FROM "RecipeRating"
    WHERE "recipeId" = NEW."recipeId"
  ),
    count = (
      SELECT COUNT(*)
      FROM "RecipeRating"
      WHERE "recipeId" = NEW."recipeId"
    )
  WHERE "recipeId" = NEW."recipeId";

  -- If there is no existing record for the recipe, insert a new one
  IF NOT FOUND THEN
    INSERT INTO "RecipeRatingAvg" ("recipeId", value, count)
    VALUES (NEW."recipeId", NEW.value, 1);
  END IF;

  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Create a trigger to execute the function after inserting or updating a RecipeRating
CREATE or replace TRIGGER recipe_rating_trigger
AFTER INSERT OR UPDATE ON "RecipeRating"
FOR EACH ROW
EXECUTE FUNCTION update_average_recipe_rating();
