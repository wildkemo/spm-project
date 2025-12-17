/*
  Warnings:

  - Added the required column `trainerId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    CONSTRAINT "Attendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attendance_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Attendance" ("date", "id", "memberId") SELECT "date", "id", "memberId" FROM "Attendance";
DROP TABLE "Attendance";
ALTER TABLE "new_Attendance" RENAME TO "Attendance";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
