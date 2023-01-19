/*
  Warnings:

  - You are about to drop the `habits-week_days` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "habits-week_days";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "habit-week_days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "habit_id" TEXT NOT NULL,
    "week_day" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "habit-week_days_habit_id_week_day_key" ON "habit-week_days"("habit_id", "week_day");
