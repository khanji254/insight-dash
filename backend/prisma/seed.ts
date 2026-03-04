/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Admin User ────────────────────────────────────────────────────────────
  const adminUser = await prisma.user.upsert({
    where: { email: "glenngatiba@gmail.com" },
    update: {},
    create: {
      email: "glenngatiba@gmail.com",
      passwordHash: await bcrypt.hash("Admin123!", 12),
      name: "Glenn Gatiba",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
  console.log(`  ✓ Admin user: ${adminUser.email}`);

  // ─── Entities ──────────────────────────────────────────────────────────────
  const entities = await Promise.all([
    prisma.entity.upsert({ where: { id: "ent-1" }, update: {}, create: { id: "ent-1", name: "Savannah Holdings Kenya Ltd", type: "Company", riskScore: 85, totalDonations: BigInt(5000000), totalContracts: BigInt(45000000), matchCount: 3, party: "Jubilee Alliance", ministry: "Ministry of Transport" } }),
    prisma.entity.upsert({ where: { id: "ent-2" }, update: {}, create: { id: "ent-2", name: "Lakeview Investments Group", type: "Company", riskScore: 78, totalDonations: BigInt(8500000), totalContracts: BigInt(120000000), matchCount: 2, party: "Orange Democratic Movement", ministry: "Ministry of Health" } }),
    prisma.entity.upsert({ where: { id: "ent-3" }, update: {}, create: { id: "ent-3", name: "KenBuild Construction Co. Ltd", type: "Company", riskScore: 92, totalDonations: BigInt(12000000), totalContracts: BigInt(250000000), matchCount: 5, party: "Jubilee Alliance", ministry: "Ministry of Roads" } }),
    prisma.entity.upsert({ where: { id: "ent-4" }, update: {}, create: { id: "ent-4", name: "James Mwangi Karanja", type: "Individual", riskScore: 45, totalDonations: BigInt(2000000), totalContracts: BigInt(0), matchCount: 1, party: "Jubilee Alliance" } }),
    prisma.entity.upsert({ where: { id: "ent-5" }, update: {}, create: { id: "ent-5", name: "Nairobi Pharmaceutical Supplies", type: "Company", riskScore: 72, totalDonations: BigInt(6000000), totalContracts: BigInt(85000000), matchCount: 2, party: "Jubilee Alliance", ministry: "Ministry of Health" } }),
  ]);
  console.log(`  ✓ ${entities.length} entities`);

  // ─── Donors ────────────────────────────────────────────────────────────────
  const donorsData = [
    { id: "don-1", name: "Savannah Holdings Ltd", amount: BigInt(5000000), party: "Jubilee Alliance", date: new Date("2022-03-15"), linkedCompany: "Savannah Holdings Kenya Ltd", entityId: "ent-1" },
    { id: "don-2", name: "James Mwangi Karanja", amount: BigInt(2000000), party: "Jubilee Alliance", date: new Date("2022-04-02"), entityId: "ent-4" },
    { id: "don-3", name: "Lakeview Investments", amount: BigInt(8500000), party: "Orange Democratic Movement", date: new Date("2022-02-20"), linkedCompany: "Lakeview Investments Group", entityId: "ent-2" },
    { id: "don-4", name: "KenBuild Construction", amount: BigInt(12000000), party: "Jubilee Alliance", date: new Date("2022-01-18"), linkedCompany: "KenBuild Construction Co. Ltd", entityId: "ent-3" },
    { id: "don-5", name: "Nairobi Pharma Ltd", amount: BigInt(6000000), party: "Jubilee Alliance", date: new Date("2022-02-10"), linkedCompany: "Nairobi Pharmaceutical Supplies", entityId: "ent-5" },
  ];
  for (const d of donorsData) {
    await prisma.donor.upsert({ where: { id: d.id }, update: {}, create: d });
  }
  console.log(`  ✓ ${donorsData.length} donors`);

  // ─── Tenders ───────────────────────────────────────────────────────────────
  const tendersData = [
    { id: "ten-1", companyName: "Savannah Holdings Kenya Ltd", amount: BigInt(45000000), ministry: "Ministry of Transport", awardDate: new Date("2022-09-15"), reference: "MOT/2022/034", entityId: "ent-1" },
    { id: "ten-2", companyName: "Lakeview Investments Group", amount: BigInt(120000000), ministry: "Ministry of Health", awardDate: new Date("2022-08-20"), reference: "MOH/2022/067", entityId: "ent-2" },
    { id: "ten-3", companyName: "KenBuild Construction Co. Ltd", amount: BigInt(250000000), ministry: "Ministry of Roads", awardDate: new Date("2022-07-10"), reference: "MOR/2022/012", entityId: "ent-3" },
    { id: "ten-4", companyName: "Nairobi Pharmaceutical Supplies", amount: BigInt(85000000), ministry: "Ministry of Health", awardDate: new Date("2022-06-28"), reference: "MOH/2022/045", entityId: "ent-5" },
  ];
  for (const t of tendersData) {
    await prisma.tender.upsert({ where: { reference: t.reference }, update: {}, create: t });
  }
  console.log(`  ✓ ${tendersData.length} tenders`);

  // ─── Red Flags ─────────────────────────────────────────────────────────────
  const redFlagsData = [
    { id: "rf-1", entityAId: "ent-1", entityBId: "ent-1", matchConfidence: 95, riskScore: 85, donationAmount: BigInt(5000000), tenderAmount: BigInt(45000000), donationDate: new Date("2022-03-15"), awardDate: new Date("2022-09-15"), ministry: "Ministry of Transport", party: "Jubilee Alliance" },
    { id: "rf-2", entityAId: "ent-2", entityBId: "ent-2", matchConfidence: 88, riskScore: 78, donationAmount: BigInt(8500000), tenderAmount: BigInt(120000000), donationDate: new Date("2022-02-20"), awardDate: new Date("2022-08-20"), ministry: "Ministry of Health", party: "Orange Democratic Movement" },
    { id: "rf-3", entityAId: "ent-3", entityBId: "ent-3", matchConfidence: 97, riskScore: 92, donationAmount: BigInt(12000000), tenderAmount: BigInt(250000000), donationDate: new Date("2022-01-18"), awardDate: new Date("2022-07-10"), ministry: "Ministry of Roads", party: "Jubilee Alliance" },
    { id: "rf-4", entityAId: "ent-5", entityBId: "ent-5", matchConfidence: 91, riskScore: 72, donationAmount: BigInt(6000000), tenderAmount: BigInt(85000000), donationDate: new Date("2022-02-10"), awardDate: new Date("2022-06-28"), ministry: "Ministry of Health", party: "Jubilee Alliance" },
  ];
  for (const r of redFlagsData) {
    await prisma.redFlag.upsert({ where: { id: r.id }, update: {}, create: r });
  }
  console.log(`  ✓ ${redFlagsData.length} red flags`);

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
