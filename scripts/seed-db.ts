import { createClient } from "@supabase/supabase-js";
import { SEED_COMPANIES } from "../src/lib/seed-companies";
import { SEED_COLLEGES } from "../src/lib/seed-colleges";
import { SEED_QUESTIONS } from "../src/lib/seed-questions";
import { SEED_QUESTIONS_EXTRA } from "../src/lib/seed-questions-extra";
import { SEED_CODING_PROBLEMS } from "../src/lib/seed-coding";
import { SEED_CODING_EXTRA } from "../src/lib/seed-coding-extra";

const SUPABASE_URL = "https://thfwefnmwrixwwldvaio.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZndlZm5td3JpeHd3bGR2YWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNTEyMjMsImV4cCI6MjEwMTkyNzIyM30.xUTWReFibzy6BkSV0ddJd3b0-Xnr7oLVCQTxnUSj4-4";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log("🚀 Starting database seeding for project thfwefnmwrixwwldvaio...");

  // 1. Companies
  console.log(`Seeding ${SEED_COMPANIES.length} companies...`);
  for (let i = 0; i < SEED_COMPANIES.length; i += 20) {
    const batch = SEED_COMPANIES.slice(i, i + 20);
    const { error } = await supabase.from("companies").upsert(batch, { onConflict: "slug" });
    if (error) console.error("Companies batch error:", error.message);
  }

  // 2. Colleges
  console.log(`Seeding ${SEED_COLLEGES.length} colleges...`);
  for (let i = 0; i < SEED_COLLEGES.length; i += 20) {
    const batch = SEED_COLLEGES.slice(i, i + 20);
    const { error } = await supabase.from("colleges").upsert(batch, { onConflict: "slug" });
    if (error) console.error("Colleges batch error:", error.message);
  }

  // 3. BBD Placement Drives
  console.log("Seeding BBD Educational Group placement drives...");
  const { data: bbdColleges } = await supabase.from("colleges").select("id, slug");
  const bbdId = bbdColleges?.find((c) => c.slug === "bbd-lucknow")?.id;
  const bbdnitmId = bbdColleges?.find((c) => c.slug === "bbdnitm-lucknow")?.id;

  const { data: companies } = await supabase.from("companies").select("id, slug");
  const companyMap = new Map((companies ?? []).map((c) => [c.slug, c.id]));

  if (bbdId && bbdnitmId) {
    const bbdDrives = [
      { company_slug: "tcs", college_id: bbdnitmId, year: 2026, role: "System Engineer", package_lpa: 3.36, verification: "verified" },
      { company_slug: "tcs", college_id: bbdId, year: 2026, role: "Digital Developer", package_lpa: 7.0, verification: "verified" },
      { company_slug: "infosys", college_id: bbdnitmId, year: 2026, role: "System Engineer", package_lpa: 3.6, verification: "verified" },
      { company_slug: "infosys", college_id: bbdId, year: 2026, role: "Specialist Programmer", package_lpa: 9.5, verification: "verified" },
      { company_slug: "wipro", college_id: bbdnitmId, year: 2026, role: "Project Engineer", package_lpa: 3.5, verification: "verified" },
      { company_slug: "cognizant", college_id: bbdId, year: 2026, role: "Programmer Analyst", package_lpa: 4.0, verification: "verified" },
      { company_slug: "cognizant", college_id: bbdnitmId, year: 2026, role: "Elevate Engineer", package_lpa: 4.25, verification: "verified" },
      { company_slug: "accenture", college_id: bbdId, year: 2026, role: "Associate Software Engineer", package_lpa: 4.5, verification: "verified" },
      { company_slug: "capgemini", college_id: bbdnitmId, year: 2026, role: "Analyst", package_lpa: 4.0, verification: "verified" },
      { company_slug: "deloitte", college_id: bbdId, year: 2026, role: "Risk & Financial Analyst", package_lpa: 7.6, verification: "verified" },
      { company_slug: "hcl", college_id: bbdnitmId, year: 2026, role: "Software Engineer", package_lpa: 3.8, verification: "verified" },
      { company_slug: "persistent-systems", college_id: bbdId, year: 2026, role: "Software Engineer", package_lpa: 6.5, verification: "verified" },
      { company_slug: "tech-mahindra", college_id: bbdnitmId, year: 2026, role: "Associate Software Engineer", package_lpa: 3.6, verification: "verified" },
    ];

    for (const d of bbdDrives) {
      const company_id = companyMap.get(d.company_slug);
      if (company_id) {
        await supabase.from("placement_drives").insert({
          company_id,
          college_id: d.college_id,
          year: d.year,
          role: d.role,
          package_lpa: d.package_lpa,
          verification: d.verification as any,
        });
      }
    }
  }

  console.log("🎉 Database seeding finished successfully!");
}

main().catch(console.error);
