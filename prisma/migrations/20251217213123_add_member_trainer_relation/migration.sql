-- CreateTable
CREATE TABLE "MemberTrainer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "subscribedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MemberTrainer_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MemberTrainer_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberTrainer_memberId_trainerId_key" ON "MemberTrainer"("memberId", "trainerId");
