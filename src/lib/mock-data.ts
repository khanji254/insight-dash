export interface Donor {
  id: string;
  name: string;
  amount: number;
  party: string;
  date: string;
  linkedCompany?: string;
}

export interface Tender {
  id: string;
  companyName: string;
  amount: number;
  ministry: string;
  awardDate: string;
  reference: string;
}

export interface Appointment {
  id: string;
  name: string;
  role: string;
  gazetteRef: string;
  date: string;
  ministry: string;
}

export interface RedFlag {
  id: string;
  entityA: string;
  entityB: string;
  matchConfidence: number;
  riskScore: number;
  donationAmount: number;
  tenderAmount: number;
  donationDate: string;
  awardDate: string;
  ministry: string;
  party: string;
}

export interface Entity {
  id: string;
  name: string;
  type: "Company" | "Individual";
  riskScore: number;
  totalDonations: number;
  totalContracts: number;
  matchCount: number;
  party?: string;
  ministry?: string;
}

export const donors: Donor[] = [
  { id: "d1", name: "Savannah Holdings Ltd", amount: 5000000, party: "Jubilee Alliance", date: "2022-03-15", linkedCompany: "Savannah Holdings Kenya Ltd" },
  { id: "d2", name: "James Mwangi Karanja", amount: 2000000, party: "Jubilee Alliance", date: "2022-04-02" },
  { id: "d3", name: "Lakeview Investments", amount: 8500000, party: "Orange Democratic Movement", date: "2022-02-20", linkedCompany: "Lakeview Investments Group" },
  { id: "d4", name: "Peter Odhiambo", amount: 1500000, party: "Orange Democratic Movement", date: "2022-05-10" },
  { id: "d5", name: "KenBuild Construction", amount: 12000000, party: "Jubilee Alliance", date: "2022-01-18", linkedCompany: "KenBuild Construction Co. Ltd" },
  { id: "d6", name: "Grace Wanjiku Muthoni", amount: 3000000, party: "Jubilee Alliance", date: "2022-06-05" },
  { id: "d7", name: "Rift Valley Traders", amount: 4500000, party: "United Democratic Alliance", date: "2022-03-28", linkedCompany: "Rift Valley Traders Ltd" },
  { id: "d8", name: "Samuel Kipchoge Rotich", amount: 7500000, party: "United Democratic Alliance", date: "2022-04-15" },
  { id: "d9", name: "Nairobi Pharma Ltd", amount: 6000000, party: "Jubilee Alliance", date: "2022-02-10", linkedCompany: "Nairobi Pharmaceutical Supplies" },
  { id: "d10", name: "Coastal Marine Services", amount: 3500000, party: "Orange Democratic Movement", date: "2022-05-22", linkedCompany: "Coastal Marine Svc" },
  { id: "d11", name: "Mary Akinyi Otieno", amount: 1000000, party: "Orange Democratic Movement", date: "2022-06-18" },
  { id: "d12", name: "Highland Agri Solutions", amount: 9000000, party: "United Democratic Alliance", date: "2022-01-30", linkedCompany: "Highland Agricultural Solutions Ltd" },
  { id: "d13", name: "David Kimutai Cheruiyot", amount: 2500000, party: "United Democratic Alliance", date: "2022-04-08" },
  { id: "d14", name: "TechVentures Kenya", amount: 4000000, party: "Jubilee Alliance", date: "2022-03-12", linkedCompany: "TechVentures Kenya Ltd" },
  { id: "d15", name: "Mombasa Logistics Group", amount: 5500000, party: "Orange Democratic Movement", date: "2022-02-28", linkedCompany: "Mombasa Logistics Grp Ltd" },
];

export const tenders: Tender[] = [
  { id: "t1", companyName: "Savannah Holdings Kenya Ltd", amount: 45000000, ministry: "Ministry of Transport", awardDate: "2022-09-15", reference: "MOT/2022/034" },
  { id: "t2", companyName: "Lakeview Investments Group", amount: 120000000, ministry: "Ministry of Health", awardDate: "2022-08-20", reference: "MOH/2022/067" },
  { id: "t3", companyName: "KenBuild Construction Co. Ltd", amount: 250000000, ministry: "Ministry of Roads", awardDate: "2022-07-10", reference: "MOR/2022/012" },
  { id: "t4", companyName: "Rift Valley Traders Ltd", amount: 35000000, ministry: "Ministry of Agriculture", awardDate: "2022-10-05", reference: "MOA/2022/089" },
  { id: "t5", companyName: "Nairobi Pharmaceutical Supplies", amount: 85000000, ministry: "Ministry of Health", awardDate: "2022-06-28", reference: "MOH/2022/045" },
  { id: "t6", companyName: "Coastal Marine Svc", amount: 55000000, ministry: "Ministry of Blue Economy", awardDate: "2022-11-12", reference: "MBE/2022/023" },
  { id: "t7", companyName: "Highland Agricultural Solutions Ltd", amount: 95000000, ministry: "Ministry of Agriculture", awardDate: "2022-08-15", reference: "MOA/2022/056" },
  { id: "t8", companyName: "TechVentures Kenya Ltd", amount: 40000000, ministry: "Ministry of ICT", awardDate: "2022-09-30", reference: "MICT/2022/078" },
  { id: "t9", companyName: "Mombasa Logistics Grp Ltd", amount: 65000000, ministry: "Ministry of Transport", awardDate: "2022-10-20", reference: "MOT/2022/091" },
  { id: "t10", companyName: "Apex Consulting Ltd", amount: 28000000, ministry: "Ministry of Finance", awardDate: "2022-07-25", reference: "MOF/2022/034" },
  { id: "t11", companyName: "Green Energy Solutions", amount: 150000000, ministry: "Ministry of Energy", awardDate: "2022-08-05", reference: "MOE/2022/019" },
  { id: "t12", companyName: "Safari IT Services", amount: 32000000, ministry: "Ministry of ICT", awardDate: "2022-09-18", reference: "MICT/2022/042" },
  { id: "t13", companyName: "Kilimani Water Works", amount: 78000000, ministry: "Ministry of Water", awardDate: "2022-11-30", reference: "MOW/2022/015" },
  { id: "t14", companyName: "Nakuru Steel Works", amount: 42000000, ministry: "Ministry of Industry", awardDate: "2022-10-10", reference: "MOI/2022/063" },
  { id: "t15", companyName: "Eldoret Textiles Ltd", amount: 18000000, ministry: "Ministry of Industry", awardDate: "2022-12-05", reference: "MOI/2022/088" },
];

export const appointments: Appointment[] = [
  { id: "a1", name: "James Mwangi Karanja", role: "PS, Ministry of Transport", gazetteRef: "KG/2022/4521", date: "2022-08-01", ministry: "Ministry of Transport" },
  { id: "a2", name: "Peter Odhiambo", role: "Board Member, KENHA", gazetteRef: "KG/2022/4890", date: "2022-09-15", ministry: "Ministry of Roads" },
  { id: "a3", name: "Grace Wanjiku Muthoni", role: "Chief Admin, Ministry of Health", gazetteRef: "KG/2022/5123", date: "2022-07-20", ministry: "Ministry of Health" },
  { id: "a4", name: "Samuel Kipchoge Rotich", role: "PS, Ministry of Agriculture", gazetteRef: "KG/2022/5567", date: "2022-08-10", ministry: "Ministry of Agriculture" },
  { id: "a5", name: "Mary Akinyi Otieno", role: "Director, KURA", gazetteRef: "KG/2022/5890", date: "2022-10-01", ministry: "Ministry of Roads" },
  { id: "a6", name: "David Kimutai Cheruiyot", role: "Board Chair, KEBS", gazetteRef: "KG/2022/6234", date: "2022-09-05", ministry: "Ministry of Industry" },
  { id: "a7", name: "Elizabeth Nyambura", role: "Deputy PS, Ministry of Energy", gazetteRef: "KG/2022/6589", date: "2022-11-01", ministry: "Ministry of Energy" },
  { id: "a8", name: "John Mutiso Kioko", role: "CEO, Kenya Ports Authority", gazetteRef: "KG/2022/6901", date: "2022-08-25", ministry: "Ministry of Transport" },
  { id: "a9", name: "Anne Chebet Kosgei", role: "PS, Ministry of ICT", gazetteRef: "KG/2022/7234", date: "2022-10-15", ministry: "Ministry of ICT" },
  { id: "a10", name: "Michael Omondi Ajuoga", role: "Board Member, KPLC", gazetteRef: "KG/2022/7567", date: "2022-11-20", ministry: "Ministry of Energy" },
];

// Fuzzy match utility
export function fuzzyMatch(a: string, b: string): number {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/\b(ltd|limited|co|company|group|grp|svc|services|kenya)\b/g, "").replace(/[^a-z0-9]/g, "").trim();
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.85;
  // Simple Dice coefficient
  const bigrams = (s: string) => {
    const set: string[] = [];
    for (let i = 0; i < s.length - 1; i++) set.push(s.slice(i, i + 2));
    return set;
  };
  const ba = bigrams(na);
  const bb = bigrams(nb);
  const intersection = ba.filter((b) => bb.includes(b)).length;
  const score = (2 * intersection) / (ba.length + bb.length);
  return Math.round(score * 100) / 100;
}

// Calculate risk score
function calcRiskScore(donationAmount: number, tenderAmount: number, donationDate: string, awardDate: string, confidence: number): number {
  const daysDiff = (new Date(awardDate).getTime() - new Date(donationDate).getTime()) / (1000 * 60 * 60 * 24);
  const timingScore = daysDiff < 90 ? 40 : daysDiff < 180 ? 25 : daysDiff < 365 ? 15 : 5;
  const ratioScore = tenderAmount / donationAmount > 10 ? 30 : tenderAmount / donationAmount > 5 ? 20 : 10;
  const confidenceScore = confidence * 30;
  return Math.min(100, Math.round(timingScore + ratioScore + confidenceScore));
}

// Generate red flags from fuzzy matching
export function generateRedFlags(): RedFlag[] {
  const flags: RedFlag[] = [];
  donors.forEach((donor) => {
    tenders.forEach((tender) => {
      const nameToMatch = donor.linkedCompany || donor.name;
      const confidence = fuzzyMatch(nameToMatch, tender.companyName);
      if (confidence >= 0.6) {
        const riskScore = calcRiskScore(donor.amount, tender.amount, donor.date, tender.awardDate, confidence);
        flags.push({
          id: `rf-${donor.id}-${tender.id}`,
          entityA: donor.name,
          entityB: tender.companyName,
          matchConfidence: confidence,
          riskScore,
          donationAmount: donor.amount,
          tenderAmount: tender.amount,
          donationDate: donor.date,
          awardDate: tender.awardDate,
          ministry: tender.ministry,
          party: donor.party,
        });
      }
    });
  });
  return flags.sort((a, b) => b.riskScore - a.riskScore);
}

// Generate entities for leaderboard
export function generateEntities(): Entity[] {
  const flags = generateRedFlags();
  const entityMap = new Map<string, Entity>();

  flags.forEach((flag) => {
    if (!entityMap.has(flag.entityA)) {
      entityMap.set(flag.entityA, {
        id: flag.entityA.replace(/\s/g, "-").toLowerCase(),
        name: flag.entityA,
        type: /ltd|limited|co|group|svc|services/i.test(flag.entityA) ? "Company" : "Individual",
        riskScore: 0,
        totalDonations: 0,
        totalContracts: 0,
        matchCount: 0,
        party: flag.party,
      });
    }
    const entity = entityMap.get(flag.entityA)!;
    entity.riskScore = Math.max(entity.riskScore, flag.riskScore);
    entity.totalDonations += flag.donationAmount;
    entity.totalContracts += flag.tenderAmount;
    entity.matchCount += 1;
    entity.ministry = flag.ministry;
  });

  return Array.from(entityMap.values()).sort((a, b) => b.riskScore - a.riskScore);
}

export const redFlags = generateRedFlags();
export const entities = generateEntities();

// AI Insights
export const aiInsights = [
  {
    id: "ai1",
    title: "High-Value Procurement Anomaly",
    text: "KenBuild Construction donated KES 12M to Jubilee Alliance in January 2022 and was awarded a KES 250M road construction tender 6 months later — a 2,083% return. This exceeds the sector average win rate by 400%.",
    severity: "high" as const,
    entity: "KenBuild Construction",
  },
  {
    id: "ai2",
    title: "Rapid Appointment-to-Award Pattern",
    text: "James Mwangi Karanja donated KES 2M, was appointed PS at Ministry of Transport in August 2022. Savannah Holdings (linked entity) then won a KES 45M transport tender one month later.",
    severity: "high" as const,
    entity: "James Mwangi Karanja",
  },
  {
    id: "ai3",
    title: "Health Sector Concentration",
    text: "The Ministry of Health shows disproportionate tender awards to entities linked to political donors — 2 of 2 MOH tenders (100%) went to flagged entities totaling KES 205M.",
    severity: "medium" as const,
    entity: "Ministry of Health",
  },
  {
    id: "ai4",
    title: "Multi-Party Influence Network",
    text: "Highland Agri Solutions donated KES 9M to UDA and won a KES 95M agriculture tender. Its director Samuel Kipchoge Rotich was simultaneously appointed PS at the same ministry.",
    severity: "high" as const,
    entity: "Highland Agri Solutions",
  },
];

export function formatKES(amount: number): string {
  if (amount >= 1000000) return `KES ${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `KES ${(amount / 1000).toFixed(0)}K`;
  return `KES ${amount}`;
}
