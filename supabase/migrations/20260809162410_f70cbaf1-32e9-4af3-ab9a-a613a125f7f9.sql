-- ENUMS
CREATE TYPE public.app_role AS ENUM ('student','moderator','admin','super_admin');
CREATE TYPE public.question_type AS ENUM ('mcq','multi_select','numerical','true_false','output_prediction','debugging','coding','sql','interview','subjective','case_study','communication');
CREATE TYPE public.question_category AS ENUM ('aptitude_quant','aptitude_logical','aptitude_verbal','technical','sql','coding','interview_technical','interview_hr','interview_managerial','interview_behavioral','case_study','other');
CREATE TYPE public.difficulty AS ENUM ('easy','medium','hard');
CREATE TYPE public.verification_status AS ENUM ('verified','candidate_reported','source_derived','unverified','ai_generated');
CREATE TYPE public.source_type AS ENUM ('github','dataset','interview_experience','college_report','user_submission','admin_import','other');
CREATE TYPE public.submission_status AS ENUM ('pending','approved','rejected','merged');

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  college_id uuid,
  branch text,
  graduation_year int,
  target_companies uuid[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ROLES
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('moderator','admin','super_admin'))
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','super_admin'))
$$;

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name) VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER t_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- COMPANIES
CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  sector text,
  company_type text,
  website text,
  logo_url text,
  description text,
  hiring_roles text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.companies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "companies public read" ON public.companies FOR SELECT USING (true);
CREATE POLICY "companies staff write" ON public.companies FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER t_companies_updated BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.company_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  alias text NOT NULL,
  normalized_alias text GENERATED ALWAYS AS (lower(regexp_replace(alias, '[^a-zA-Z0-9]', '', 'g'))) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, alias)
);
CREATE INDEX idx_company_aliases_norm ON public.company_aliases (normalized_alias);
GRANT SELECT ON public.company_aliases TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_aliases TO authenticated;
GRANT ALL ON public.company_aliases TO service_role;
ALTER TABLE public.company_aliases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "aliases public read" ON public.company_aliases FOR SELECT USING (true);
CREATE POLICY "aliases staff write" ON public.company_aliases FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- COLLEGES
CREATE TABLE public.colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_name text,
  city text,
  state text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.colleges TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.colleges TO authenticated;
GRANT ALL ON public.colleges TO service_role;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "colleges public read" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "colleges staff write" ON public.colleges FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
ALTER TABLE public.profiles ADD CONSTRAINT profiles_college_fk FOREIGN KEY (college_id) REFERENCES public.colleges(id) ON DELETE SET NULL;

-- DRIVES
CREATE TABLE public.placement_drives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  college_id uuid REFERENCES public.colleges(id) ON DELETE SET NULL,
  year int NOT NULL,
  session text,
  role text,
  drive_date date,
  eligibility text,
  package_lpa numeric,
  rounds jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  verification public.verification_status NOT NULL DEFAULT 'source_derived',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_drives_company ON public.placement_drives (company_id, year);
CREATE INDEX idx_drives_college ON public.placement_drives (college_id, year);
GRANT SELECT ON public.placement_drives TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.placement_drives TO authenticated;
GRANT ALL ON public.placement_drives TO service_role;
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "drives public read" ON public.placement_drives FOR SELECT USING (true);
CREATE POLICY "drives staff write" ON public.placement_drives FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- QUESTIONS
CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  question_text text NOT NULL,
  options jsonb,
  answer text,
  explanation text,
  question_type public.question_type NOT NULL DEFAULT 'mcq',
  category public.question_category NOT NULL DEFAULT 'other',
  topic text,
  subtopic text,
  difficulty public.difficulty NOT NULL DEFAULT 'medium',
  round text,
  role text,
  primary_year int,
  content_hash text UNIQUE,
  report_count int NOT NULL DEFAULT 1,
  source_count int NOT NULL DEFAULT 1,
  verification public.verification_status NOT NULL DEFAULT 'source_derived',
  confidence numeric NOT NULL DEFAULT 0.5,
  search_tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce(title,'') || ' ' || question_text || ' ' || coalesce(topic,''))) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_questions_tsv ON public.questions USING gin (search_tsv);
CREATE INDEX idx_questions_cat ON public.questions (category, difficulty);
CREATE INDEX idx_questions_topic ON public.questions (topic);
CREATE INDEX idx_questions_year ON public.questions (primary_year);
GRANT SELECT ON public.questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT ALL ON public.questions TO service_role;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions public read" ON public.questions FOR SELECT USING (true);
CREATE POLICY "questions staff write" ON public.questions FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER t_questions_updated BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.question_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  college_id uuid REFERENCES public.colleges(id) ON DELETE CASCADE,
  drive_id uuid REFERENCES public.placement_drives(id) ON DELETE SET NULL,
  year int,
  round text,
  role text,
  report_count int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_qlinks_company ON public.question_links (company_id, year);
CREATE INDEX idx_qlinks_college ON public.question_links (college_id, year);
CREATE INDEX idx_qlinks_question ON public.question_links (question_id);
GRANT SELECT ON public.question_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.question_links TO authenticated;
GRANT ALL ON public.question_links TO service_role;
ALTER TABLE public.question_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qlinks public read" ON public.question_links FOR SELECT USING (true);
CREATE POLICY "qlinks staff write" ON public.question_links FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- CODING PROBLEMS
CREATE TABLE public.coding_problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  external_id text,
  url text,
  platform text,
  difficulty public.difficulty NOT NULL DEFAULT 'medium',
  topics text[] NOT NULL DEFAULT '{}',
  total_reports int NOT NULL DEFAULT 0,
  company_count int NOT NULL DEFAULT 0,
  search_tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || coalesce(description,''))) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_coding_tsv ON public.coding_problems USING gin (search_tsv);
CREATE INDEX idx_coding_topics ON public.coding_problems USING gin (topics);
GRANT SELECT ON public.coding_problems TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coding_problems TO authenticated;
GRANT ALL ON public.coding_problems TO service_role;
ALTER TABLE public.coding_problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coding public read" ON public.coding_problems FOR SELECT USING (true);
CREATE POLICY "coding staff write" ON public.coding_problems FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER t_coding_updated BEFORE UPDATE ON public.coding_problems FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.problem_company (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id uuid NOT NULL REFERENCES public.coding_problems(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  report_count int NOT NULL DEFAULT 1,
  source_count int NOT NULL DEFAULT 1,
  years int[] NOT NULL DEFAULT '{}',
  last_reported_year int,
  UNIQUE (problem_id, company_id)
);
CREATE INDEX idx_pc_company ON public.problem_company (company_id, report_count DESC);
GRANT SELECT ON public.problem_company TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.problem_company TO authenticated;
GRANT ALL ON public.problem_company TO service_role;
ALTER TABLE public.problem_company ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pc public read" ON public.problem_company FOR SELECT USING (true);
CREATE POLICY "pc staff write" ON public.problem_company FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- SOURCES
CREATE TABLE public.sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type public.source_type NOT NULL DEFAULT 'other',
  name text NOT NULL,
  url text,
  repo_full_name text,
  commit_sha text,
  reliability numeric NOT NULL DEFAULT 0.5,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sources TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sources TO authenticated;
GRANT ALL ON public.sources TO service_role;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sources public read" ON public.sources FOR SELECT USING (true);
CREATE POLICY "sources staff write" ON public.sources FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.source_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE,
  problem_id uuid REFERENCES public.coding_problems(id) ON DELETE CASCADE,
  raw_excerpt text,
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_source_records_q ON public.source_records (question_id);
CREATE INDEX idx_source_records_p ON public.source_records (problem_id);
GRANT SELECT ON public.source_records TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.source_records TO authenticated;
GRANT ALL ON public.source_records TO service_role;
ALTER TABLE public.source_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "source records public read" ON public.source_records FOR SELECT USING (true);
CREATE POLICY "source records staff write" ON public.source_records FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- GITHUB INGESTION
CREATE TABLE public.repositories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL UNIQUE,
  html_url text,
  description text,
  stars int NOT NULL DEFAULT 0,
  topics text[] NOT NULL DEFAULT '{}',
  discovery_query text,
  status text NOT NULL DEFAULT 'discovered',
  last_analyzed_at timestamptz,
  questions_found int NOT NULL DEFAULT 0,
  problems_found int NOT NULL DEFAULT 0,
  companies_found int NOT NULL DEFAULT 0,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.repositories TO authenticated;
GRANT ALL ON public.repositories TO service_role;
ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "repos staff read" ON public.repositories FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "repos admin write" ON public.repositories FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.import_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id uuid REFERENCES public.repositories(id) ON DELETE SET NULL,
  source_id uuid REFERENCES public.sources(id) ON DELETE SET NULL,
  kind text NOT NULL DEFAULT 'github',
  status text NOT NULL DEFAULT 'preview',
  stats jsonb NOT NULL DEFAULT '{}'::jsonb,
  payload jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.import_batches TO authenticated;
GRANT ALL ON public.import_batches TO service_role;
ALTER TABLE public.import_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "imports staff read" ON public.import_batches FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "imports admin write" ON public.import_batches FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- SUBMISSIONS
CREATE TABLE public.user_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text,
  college_name text,
  year int,
  role text,
  round text,
  question_type public.question_type NOT NULL DEFAULT 'interview',
  content text NOT NULL,
  status public.submission_status NOT NULL DEFAULT 'pending',
  review_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_submissions TO authenticated;
GRANT ALL ON public.user_submissions TO service_role;
ALTER TABLE public.user_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own submissions" ON public.user_submissions FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "staff moderate submissions" ON public.user_submissions FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- PRACTICE
CREATE TABLE public.attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE,
  problem_id uuid REFERENCES public.coding_problems(id) ON DELETE CASCADE,
  is_correct boolean,
  time_taken_seconds int,
  answer text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_attempts_user ON public.attempts (user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attempts TO authenticated;
GRANT ALL ON public.attempts TO service_role;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own attempts" ON public.attempts FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.mock_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  mock_type text NOT NULL DEFAULT 'company',
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  question_ids uuid[] NOT NULL DEFAULT '{}',
  score numeric,
  accuracy numeric,
  total_questions int NOT NULL DEFAULT 0,
  duration_seconds int,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_mocks_user ON public.mock_tests (user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mock_tests TO authenticated;
GRANT ALL ON public.mock_tests TO service_role;
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own mocks" ON public.mock_tests FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());