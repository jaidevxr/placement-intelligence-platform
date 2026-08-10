-- Allow anon and authenticated users to insert/upsert initial seed data into core platform tables

CREATE POLICY "companies anon insert" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "companies anon update" ON public.companies FOR UPDATE USING (true);

CREATE POLICY "colleges anon insert" ON public.colleges FOR INSERT WITH CHECK (true);
CREATE POLICY "colleges anon update" ON public.colleges FOR UPDATE USING (true);

CREATE POLICY "drives anon insert" ON public.placement_drives FOR INSERT WITH CHECK (true);
CREATE POLICY "drives anon update" ON public.placement_drives FOR UPDATE USING (true);

CREATE POLICY "questions anon insert" ON public.questions FOR INSERT WITH CHECK (true);
CREATE POLICY "questions anon update" ON public.questions FOR UPDATE USING (true);

CREATE POLICY "qlinks anon insert" ON public.question_links FOR INSERT WITH CHECK (true);
CREATE POLICY "qlinks anon update" ON public.question_links FOR UPDATE USING (true);

CREATE POLICY "coding anon insert" ON public.coding_problems FOR INSERT WITH CHECK (true);
CREATE POLICY "coding anon update" ON public.coding_problems FOR UPDATE USING (true);

CREATE POLICY "pc anon insert" ON public.problem_company FOR INSERT WITH CHECK (true);
CREATE POLICY "pc anon update" ON public.problem_company FOR UPDATE USING (true);
