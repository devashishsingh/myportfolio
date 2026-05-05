-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "track" TEXT,
    "difficulty" INTEGER NOT NULL DEFAULT 2,
    "brief" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "rubric" TEXT,
    "points" INTEGER NOT NULL DEFAULT 50,
    "badgeSlug" TEXT,
    "opensAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closesAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeSubmission" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "score" INTEGER,
    "adminNote" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gradedAt" TIMESTAMP(3),

    CONSTRAINT "ChallengeSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_slug_key" ON "Challenge"("slug");

-- CreateIndex
CREATE INDEX "Challenge_closesAt_idx" ON "Challenge"("closesAt");

-- CreateIndex
CREATE INDEX "Challenge_published_closesAt_idx" ON "Challenge"("published", "closesAt");

-- CreateIndex
CREATE INDEX "ChallengeSubmission_challengeId_idx" ON "ChallengeSubmission"("challengeId");

-- CreateIndex
CREATE INDEX "ChallengeSubmission_memberId_idx" ON "ChallengeSubmission"("memberId");

-- CreateIndex
CREATE INDEX "ChallengeSubmission_status_idx" ON "ChallengeSubmission"("status");

-- AddForeignKey
ALTER TABLE "ChallengeSubmission" ADD CONSTRAINT "ChallengeSubmission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeSubmission" ADD CONSTRAINT "ChallengeSubmission_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
