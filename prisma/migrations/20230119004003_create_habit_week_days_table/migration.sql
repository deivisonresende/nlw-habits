-- CreateTable
CREATE TABLE "habits-week_days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "habit_id" TEXT NOT NULL,
    "week_day" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "habits-week_days_habit_id_week_day_key" ON "habits-week_days"("habit_id", "week_day");
