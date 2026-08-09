// Seed orchestrator: inserts all data into Supabase in correct dependency order
import { supabase } from "@/integrations/supabase/client";
import { SEED_COMPANIES } from "./seed-companies";
import { SEED_COLLEGES } from "./seed-colleges";
import { SEED_QUESTIONS } from "./seed-questions";
import { SEED_QUESTIONS_EXTRA } from "./seed-questions-extra";
import { SEED_CODING_PROBLEMS } from "./seed-coding";
import { SEED_CODING_EXTRA } from "./seed-coding-extra";

const ALL_QUESTIONS = [...SEED_QUESTIONS, ...SEED_QUESTIONS_EXTRA];

// Normalize extra coding problems to match the base format
const EXTRA_NORMALIZED = SEED_CODING_EXTRA.map((p) => ({
  ...p,
  companies: p.companies.map((c) => ({ slug: c.slug, report_count: c.count, years: [2023, 2024] })),
}));
// Deduplicate by slug — base takes priority
const seenSlugs = new Set(SEED_CODING_PROBLEMS.map((p) => p.slug));
const ALL_CODING = [...SEED_CODING_PROBLEMS, ...EXTRA_NORMALIZED.filter((p) => !seenSlugs.has(p.slug))];

export type SeedProgress = {
  step: string;
  done: number;
  total: number;
  status: "running" | "done" | "error";
  error?: string;
};

export async function runSeed(onProgress: (p: SeedProgress) => void) {
  const report = (step: string, done: number, total: number) =>
    onProgress({ step, done, total, status: "running" });

  try {
    // ───── 1. COMPANIES ─────
    report("Inserting companies…", 0, SEED_COMPANIES.length);
    const companyMap: Record<string, string> = {};
    for (let i = 0; i < SEED_COMPANIES.length; i += 20) {
      const batch = SEED_COMPANIES.slice(i, i + 20);
      const { data, error } = await supabase
        .from("companies")
        .upsert(batch, { onConflict: "slug" })
        .select("id, slug");
      if (error) throw new Error(`Companies: ${error.message}`);
      for (const c of data ?? []) companyMap[c.slug] = c.id;
      report("Inserting companies…", Math.min(i + 20, SEED_COMPANIES.length), SEED_COMPANIES.length);
    }
    // Fetch all company IDs (in case some existed before)
    const { data: allCompanies } = await supabase.from("companies").select("id, slug");
    for (const c of allCompanies ?? []) companyMap[c.slug] = c.id;

    // ───── 2. COLLEGES ─────
    report("Inserting colleges…", 0, SEED_COLLEGES.length);
    const collegeMap: Record<string, string> = {};
    for (let i = 0; i < SEED_COLLEGES.length; i += 20) {
      const batch = SEED_COLLEGES.slice(i, i + 20);
      const { data, error } = await supabase
        .from("colleges")
        .upsert(batch, { onConflict: "slug" })
        .select("id, slug");
      if (error) throw new Error(`Colleges: ${error.message}`);
      for (const c of data ?? []) collegeMap[c.slug] = c.id;
      report("Inserting colleges…", Math.min(i + 20, SEED_COLLEGES.length), SEED_COLLEGES.length);
    }
    const { data: allColleges } = await supabase.from("colleges").select("id, slug");
    for (const c of allColleges ?? []) collegeMap[c.slug] = c.id;

    // ───── 3. SOURCES ─────
    report("Inserting sources…", 0, 5);
    const sources = [
      { name: "LeetCode Company Tags", source_type: "dataset", url: "https://leetcode.com/", reliability: 0.9 },
      { name: "GeeksforGeeks Placement Archive", source_type: "dataset", url: "https://www.geeksforgeeks.org/", reliability: 0.85 },
      { name: "Placement Season GitHub Repos", source_type: "github", url: "https://github.com/", reliability: 0.75 },
      { name: "InterviewBit Company Problems", source_type: "dataset", url: "https://www.interviewbit.com/", reliability: 0.8 },
      { name: "IndiaBix Aptitude", source_type: "dataset", url: "https://www.indiabix.com/", reliability: 0.7 },
    ];
    for (const s of sources) {
      await supabase.from("sources").insert(s as any);
    }
    report("Inserting sources…", 5, 5);

    // ───── 4. QUESTIONS + LINKS ─────
    report("Inserting questions…", 0, SEED_QUESTIONS.length);
    for (let i = 0; i < SEED_QUESTIONS.length; i++) {
      const q = SEED_QUESTIONS[i]!;
      const questionRow = {
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
      };

      const { data: qData, error: qErr } = await supabase
        .from("questions")
        .insert(questionRow as any)
        .select("id")
        .single();
      if (qErr) {
        console.warn(`Q ${i} skip:`, qErr.message);
        continue;
      }

      // Create question_links
      if (q.companies?.length && qData) {
        const links = q.companies
          .filter((slug) => companyMap[slug])
          .flatMap((slug) =>
            (q.years ?? [2024]).map((year) => ({
              question_id: qData.id,
              company_id: companyMap[slug]!,
              year,
              round: q.round || null,
              report_count: Math.ceil(Math.random() * 5) + 1,
            })),
          );
        if (links.length) {
          await supabase.from("question_links").insert(links);
        }
      }
      if ((i + 1) % 5 === 0) report("Inserting questions…", i + 1, ALL_QUESTIONS.length);
    }
    report("Inserting questions…", ALL_QUESTIONS.length, ALL_QUESTIONS.length);

    // ───── 5. CODING PROBLEMS + COMPANY LINKS ─────
    report("Inserting coding problems…", 0, ALL_CODING.length);
    for (let i = 0; i < ALL_CODING.length; i++) {
      const p = ALL_CODING[i]!;
      const totalReports = p.companies.reduce((s, c) => s + c.report_count, 0);
      const problemRow = {
        slug: p.slug,
        title: p.title,
        description: p.description,
        url: p.url,
        platform: p.platform,
        difficulty: p.difficulty,
        topics: p.topics,
        total_reports: totalReports,
        company_count: p.companies.length,
      };

      const { data: pData, error: pErr } = await supabase
        .from("coding_problems")
        .upsert(problemRow as any, { onConflict: "slug" })
        .select("id")
        .single();
      if (pErr) {
        console.warn(`Problem ${p.slug} skip:`, pErr.message);
        continue;
      }

      // Create problem_company links
      if (pData) {
        const pcLinks = p.companies
          .filter((c) => companyMap[c.slug])
          .map((c) => ({
            problem_id: pData.id,
            company_id: companyMap[c.slug]!,
            report_count: c.report_count,
            years: c.years,
            last_reported_year: Math.max(...c.years),
            source_count: Math.ceil(c.report_count / 5),
          }));
        if (pcLinks.length) {
          await supabase
            .from("problem_company")
            .upsert(pcLinks, { onConflict: "problem_id,company_id" as any, ignoreDuplicates: true });
        }
      }
      if ((i + 1) % 5 === 0) report("Inserting coding problems…", i + 1, ALL_CODING.length);
    }
    report("Inserting coding problems…", ALL_CODING.length, ALL_CODING.length);

    // ───── 6. PLACEMENT DRIVES ─────
    report("Creating placement drives…", 0, 30);
    const driveCompanies = ["tcs", "infosys", "wipro", "cognizant", "accenture", "capgemini", "amazon", "google", "microsoft", "flipkart", "adobe", "oracle", "goldman-sachs", "deloitte", "hcl"];
    const driveColleges = ["iit-bombay", "iit-delhi", "nit-trichy", "bits-pilani", "bbd-lucknow", "bbdnitm-lucknow", "dtu-delhi", "vit-vellore"];
    const drives: any[] = [];
    for (const cs of driveCompanies) {
      // Pick some random colleges, but ALWAYS guarantee BBD gets seeded for every company
      const randomColleges = driveColleges.slice(0, 3 + Math.floor(Math.random() * 5));
      const targetColleges = new Set([...randomColleges, "bbd-lucknow", "bbdnitm-lucknow"]);

      for (const cl of targetColleges) {
        if (!companyMap[cs] || !collegeMap[cl]) continue;
        for (const yr of [2026, 2025]) {
          drives.push({
            company_id: companyMap[cs],
            college_id: collegeMap[cl],
            year: yr,
            role: ["SDE", "SDE-1", "Systems Engineer", "Analyst", "GET"][Math.floor(Math.random() * 5)],
            package_lpa: cs.includes("tcs") ? 3.36 + Math.random() * 5 : cs.includes("google") ? 30 + Math.random() * 20 : 5 + Math.random() * 20,
            rounds: JSON.stringify([
              { name: "Online Assessment", type: "online_assessment" },
              { name: "Technical Round 1", type: "technical_interview" },
              { name: "Technical Round 2", type: "technical_interview" },
              { name: "HR Round", type: "hr_interview" },
            ]),
            verification: "source_derived",
          });
        }
      }
    }
    for (let i = 0; i < drives.length; i += 25) {
      const batch = drives.slice(i, i + 25);
      await supabase.from("placement_drives").insert(batch);
      report("Creating placement drives…", Math.min(i + 25, drives.length), drives.length);
    }

    onProgress({ step: "Seed complete!", done: 1, total: 1, status: "done" });
  } catch (e: any) {
    onProgress({ step: e.message, done: 0, total: 0, status: "error", error: e.message });
  }
}
