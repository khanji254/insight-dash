-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'VIEWER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "totalDonations" BIGINT NOT NULL DEFAULT 0,
    "totalContracts" BIGINT NOT NULL DEFAULT 0,
    "matchCount" INTEGER NOT NULL DEFAULT 0,
    "party" TEXT,
    "ministry" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Donor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "party" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "linkedCompany" TEXT,
    "entityId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Donor_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tender" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "ministry" TEXT NOT NULL,
    "awardDate" DATETIME NOT NULL,
    "reference" TEXT NOT NULL,
    "entityId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tender_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "gazetteRef" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "ministry" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RedFlag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityAId" TEXT NOT NULL,
    "entityBId" TEXT NOT NULL,
    "matchConfidence" INTEGER NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "donationAmount" BIGINT NOT NULL,
    "tenderAmount" BIGINT NOT NULL,
    "donationDate" DATETIME NOT NULL,
    "awardDate" DATETIME NOT NULL,
    "ministry" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RedFlag_entityAId_fkey" FOREIGN KEY ("entityAId") REFERENCES "Entity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RedFlag_entityBId_fkey" FOREIGN KEY ("entityBId") REFERENCES "Entity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_token_idx" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "Entity_riskScore_idx" ON "Entity"("riskScore");

-- CreateIndex
CREATE INDEX "Entity_name_idx" ON "Entity"("name");

-- CreateIndex
CREATE INDEX "Donor_party_idx" ON "Donor"("party");

-- CreateIndex
CREATE INDEX "Donor_date_idx" ON "Donor"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Tender_reference_key" ON "Tender"("reference");

-- CreateIndex
CREATE INDEX "Tender_ministry_idx" ON "Tender"("ministry");

-- CreateIndex
CREATE INDEX "Tender_awardDate_idx" ON "Tender"("awardDate");

-- CreateIndex
CREATE INDEX "Appointment_ministry_idx" ON "Appointment"("ministry");

-- CreateIndex
CREATE INDEX "Appointment_date_idx" ON "Appointment"("date");

-- CreateIndex
CREATE INDEX "RedFlag_riskScore_idx" ON "RedFlag"("riskScore");

-- CreateIndex
CREATE INDEX "RedFlag_entityAId_idx" ON "RedFlag"("entityAId");

-- CreateIndex
CREATE INDEX "RedFlag_entityBId_idx" ON "RedFlag"("entityBId");
