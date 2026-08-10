-- Safely enable initial seed inserts for public tables

DROP POLICY IF EXISTS "companies anon insert" ON public.companies;
DROP POLICY IF EXISTS "companies anon update" ON public.companies;
CREATE POLICY "companies anon insert" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "companies anon update" ON public.companies FOR UPDATE USING (true);

DROP POLICY IF EXISTS "colleges anon insert" ON public.colleges;
DROP POLICY IF EXISTS "colleges anon update" ON public.colleges;
CREATE POLICY "colleges anon insert" ON public.colleges FOR INSERT WITH CHECK (true);
CREATE POLICY "colleges anon update" ON public.colleges FOR UPDATE USING (true);

DROP POLICY IF EXISTS "drives anon insert" ON public.placement_drives;
DROP POLICY IF EXISTS "drives anon update" ON public.placement_drives;
CREATE POLICY "drives anon insert" ON public.placement_drives FOR INSERT WITH CHECK (true);
CREATE POLICY "drives anon update" ON public.placement_drives FOR UPDATE USING (true);

DROP POLICY IF EXISTS "questions anon insert" ON public.questions;
DROP POLICY IF EXISTS "questions anon update" ON public.questions;
CREATE POLICY "questions anon insert" ON public.questions FOR INSERT WITH CHECK (true);
CREATE POLICY "questions anon update" ON public.questions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "qlinks anon insert" ON public.question_links;
DROP POLICY IF EXISTS "qlinks anon update" ON public.question_links;
CREATE POLICY "qlinks anon insert" ON public.question_links FOR INSERT WITH CHECK (true);
CREATE POLICY "qlinks anon update" ON public.question_links FOR UPDATE USING (true);

DROP POLICY IF EXISTS "coding anon insert" ON public.coding_problems;
DROP POLICY IF EXISTS "coding anon update" ON public.coding_problems;
CREATE POLICY "coding anon insert" ON public.coding_problems FOR INSERT WITH CHECK (true);
CREATE POLICY "coding anon update" ON public.coding_problems FOR UPDATE USING (true);

DROP POLICY IF EXISTS "pc anon insert" ON public.problem_company;
DROP POLICY IF EXISTS "pc anon update" ON public.problem_company;
CREATE POLICY "pc anon insert" ON public.problem_company FOR INSERT WITH CHECK (true);
CREATE POLICY "pc anon update" ON public.problem_company FOR UPDATE USING (true);
