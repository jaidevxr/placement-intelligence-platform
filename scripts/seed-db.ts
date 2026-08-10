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

const ALL_QUESTIONS = [...SEED_QUESTIONS, ...SEED_QUESTIONS_EXTRA];

// Normalize extra coding problems
const EXTRA_NORMALIZED = SEED_CODING_EXTRA.map((p) => ({
  ...p,
  companies: p.companies.map((c) => ({ slug: c.slug, report_count: c.count, years: [2023, 2024] })),
}));
const seenSlugs = new Set(SEED_CODING_PROBLEMS.map((p) => p.slug));
const ALL_CODING = [...SEED_CODING_PROBLEMS, ...EXTRA_NORMALIZED.filter((p) => !seenSlugs.has(p.slug))];

async function main() {
  console.log("🚀 Seeding database for Supabase project thfwefnmwrixwwldvaio...");

  // 1. Companies
  console.log(`[1/5] Seeding ${SEED_COMPANIES.length} companies...`);
  const companyMap = new Map<string, string>();
  for (let i = 0; i < SEED_COMPANIES.length; i += 25) {
    const batch = SEED_COMPANIES.slice(i, i + 25);
    const { data, error } = await supabase.from("companies").upsert(batch, { onConflict: "slug" }).select("id, slug");
    if (error) console.error("Companies batch error:", error.message);
    (data ?? []).forEach((c) => companyMap.set(c.slug, c.id));
  }
  const { data: allComp } = await supabase.from("companies").select("id, slug");
  (allComp ?? []).forEach((c) => companyMap.set(c.slug, c.id));

  // 2. Colleges
  console.log(`[2/5] Seeding ${SEED_COLLEGES.length} colleges...`);
  const collegeMap = new Map<string, string>();
  for (let i = 0; i < SEED_COLLEGES.length; i += 25) {
    const batch = SEED_COLLEGES.slice(i, i + 25);
    const { data, error } = await supabase.from("colleges").upsert(batch, { onConflict: "slug" }).select("id, slug");
    if (error) console.error("Colleges batch error:", error.message);
    (data ?? []).forEach((c) => collegeMap.set(c.slug, c.id));
  }
  const { data: allColl } = await supabase.from("colleges").select("id, slug");
  (allColl ?? []).forEach((c) => collegeMap.set(c.slug, c.id));

  // 3. Placement Drives (Real BBD Campus Drives)
  console.log("[3/5] Seeding BBD Educational Group placement drives...");
  const bbdId = collegeMap.get("bbd-lucknow");
  const bbdnitmId = collegeMap.get("bbdnitm-lucknow");

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

  // 4. Questions & Question Links
  console.log(`[4/5] Seeding ${ALL_QUESTIONS.length} questions...`);
  for (let i = 0; i < ALL_QUESTIONS.length; i += 20) {
    const batch = ALL_QUESTIONS.slice(i, i + 20).map((q: any) => ({
      title: q.title || null,
      question_text: q.question_text,
      options: q.options ? JSON.parse(JSON.stringify(q.options)) : null,
      answer: q.answer || null,
      explanation: q.explanation || null,
      question_type: q.question_type,
      category: q.category,
      topic: q.topic,
      subtopic: q.subtopic || null,
      difficulty: q.difficulty,
      verification: q.verification || "source_derived",
      report_count: (q.companies?.length ?? 1) * 3,
      source_count: Math.max(1, q.companies?.length ?? 1),
    }));

    const { data: insertedQ, error: qErr } = await supabase.from("questions").insert(batch).select("id");
    if (qErr) {
      console.error("Questions insert error:", qErr.message);
      continue;
    }

    if (insertedQ) {
      const linksToInsert: any[] = [];
      insertedQ.forEach((qRow, idx) => {
        const origQ: any = ALL_QUESTIONS[i + idx];
        if (origQ?.companies) {
          for (const cSlug of origQ.companies) {
            const compId = companyMap.get(cSlug);
            if (compId) {
              linksToInsert.push({
                question_id: qRow.id,
                company_id: compId,
                year: origQ.years?.[0] ?? 2026,
                round: origQ.round ?? "online_assessment",
                report_count: 5,
              });
            }
          }
        }
      });
      if (linksToInsert.length > 0) {
        await supabase.from("question_links").insert(linksToInsert);
      }
    }
  }

  // 5. Coding Problems
  console.log(`[5/5] Seeding ${ALL_CODING.length} LeetCode coding problems...`);
  for (let i = 0; i < ALL_CODING.length; i += 20) {
    const batch = ALL_CODING.slice(i, i + 20).map((p: any) => ({
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      topics: p.topics,
      url: p.url,
      platform: p.platform || "leetcode",
      total_reports: p.companies.reduce((s: number, c: any) => s + (c.report_count || c.count || 10), 0),
    }));

    const { data: insertedP, error: pErr } = await supabase.from("coding_problems").upsert(batch, { onConflict: "slug" }).select("id, slug");
    if (pErr) console.error("Coding problems insert error:", pErr.message);

    if (insertedP) {
      const pcToInsert: any[] = [];
      insertedP.forEach((pRow) => {
        const origP = ALL_CODING.find((item: any) => item.slug === pRow.slug);
        if (origP) {
          for (const c of origP.companies) {
            const compId = companyMap.get(c.slug);
            if (compId) {
              pcToInsert.push({
                problem_id: pRow.id,
                company_id: compId,
                report_count: c.report_count || c.count || 10,
                last_reported_year: 2026,
              });
            }
          }
        }
      });
      if (pcToInsert.length > 0) {
        await supabase.from("problem_company").upsert(pcToInsert, { onConflict: "problem_id,company_id" });
      }
    }
  }

  console.log("🎉 Complete Database Seeding Finished Successfully!");
}

main().catch(console.error);
