export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      attempts: {
        Row: {
          answer: string | null
          created_at: string
          id: string
          is_correct: boolean | null
          problem_id: string | null
          question_id: string | null
          time_taken_seconds: number | null
          user_id: string
        }
        Insert: {
          answer?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean | null
          problem_id?: string | null
          question_id?: string | null
          time_taken_seconds?: number | null
          user_id: string
        }
        Update: {
          answer?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean | null
          problem_id?: string | null
          question_id?: string | null
          time_taken_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attempts_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "coding_problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      coding_problems: {
        Row: {
          company_count: number
          created_at: string
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty"]
          external_id: string | null
          id: string
          platform: string | null
          search_tsv: unknown
          slug: string
          title: string
          topics: string[]
          total_reports: number
          updated_at: string
          url: string | null
        }
        Insert: {
          company_count?: number
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"]
          external_id?: string | null
          id?: string
          platform?: string | null
          search_tsv?: unknown
          slug: string
          title: string
          topics?: string[]
          total_reports?: number
          updated_at?: string
          url?: string | null
        }
        Update: {
          company_count?: number
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"]
          external_id?: string | null
          id?: string
          platform?: string | null
          search_tsv?: unknown
          slug?: string
          title?: string
          topics?: string[]
          total_reports?: number
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      colleges: {
        Row: {
          city: string | null
          created_at: string
          id: string
          is_featured: boolean
          name: string
          short_name: string | null
          slug: string
          state: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          name: string
          short_name?: string | null
          slug: string
          state?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          name?: string
          short_name?: string | null
          slug?: string
          state?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          company_type: string | null
          created_at: string
          description: string | null
          hiring_roles: string[]
          id: string
          logo_url: string | null
          name: string
          sector: string | null
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          company_type?: string | null
          created_at?: string
          description?: string | null
          hiring_roles?: string[]
          id?: string
          logo_url?: string | null
          name: string
          sector?: string | null
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          company_type?: string | null
          created_at?: string
          description?: string | null
          hiring_roles?: string[]
          id?: string
          logo_url?: string | null
          name?: string
          sector?: string | null
          slug?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      company_aliases: {
        Row: {
          alias: string
          company_id: string
          created_at: string
          id: string
          normalized_alias: string | null
        }
        Insert: {
          alias: string
          company_id: string
          created_at?: string
          id?: string
          normalized_alias?: string | null
        }
        Update: {
          alias?: string
          company_id?: string
          created_at?: string
          id?: string
          normalized_alias?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_aliases_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      import_batches: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          kind: string
          payload: Json | null
          repository_id: string | null
          source_id: string | null
          stats: Json
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          payload?: Json | null
          repository_id?: string | null
          source_id?: string | null
          stats?: Json
          status?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          payload?: Json | null
          repository_id?: string | null
          source_id?: string | null
          stats?: Json
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_batches_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_batches_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_tests: {
        Row: {
          accuracy: number | null
          company_id: string | null
          completed_at: string | null
          config: Json
          created_at: string
          duration_seconds: number | null
          id: string
          mock_type: string
          question_ids: string[]
          score: number | null
          total_questions: number
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          company_id?: string | null
          completed_at?: string | null
          config?: Json
          created_at?: string
          duration_seconds?: number | null
          id?: string
          mock_type?: string
          question_ids?: string[]
          score?: number | null
          total_questions?: number
          user_id: string
        }
        Update: {
          accuracy?: number | null
          company_id?: string | null
          completed_at?: string | null
          config?: Json
          created_at?: string
          duration_seconds?: number | null
          id?: string
          mock_type?: string
          question_ids?: string[]
          score?: number | null
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_tests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      placement_drives: {
        Row: {
          college_id: string | null
          company_id: string
          created_at: string
          drive_date: string | null
          eligibility: string | null
          id: string
          notes: string | null
          package_lpa: number | null
          role: string | null
          rounds: Json
          session: string | null
          verification: Database["public"]["Enums"]["verification_status"]
          year: number
        }
        Insert: {
          college_id?: string | null
          company_id: string
          created_at?: string
          drive_date?: string | null
          eligibility?: string | null
          id?: string
          notes?: string | null
          package_lpa?: number | null
          role?: string | null
          rounds?: Json
          session?: string | null
          verification?: Database["public"]["Enums"]["verification_status"]
          year: number
        }
        Update: {
          college_id?: string | null
          company_id?: string
          created_at?: string
          drive_date?: string | null
          eligibility?: string | null
          id?: string
          notes?: string | null
          package_lpa?: number | null
          role?: string | null
          rounds?: Json
          session?: string | null
          verification?: Database["public"]["Enums"]["verification_status"]
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "placement_drives_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placement_drives_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_company: {
        Row: {
          company_id: string
          id: string
          last_reported_year: number | null
          problem_id: string
          report_count: number
          source_count: number
          years: number[]
        }
        Insert: {
          company_id: string
          id?: string
          last_reported_year?: number | null
          problem_id: string
          report_count?: number
          source_count?: number
          years?: number[]
        }
        Update: {
          company_id?: string
          id?: string
          last_reported_year?: number | null
          problem_id?: string
          report_count?: number
          source_count?: number
          years?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "problem_company_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_company_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "coding_problems"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          branch: string | null
          college_id: string | null
          created_at: string
          full_name: string | null
          graduation_year: number | null
          id: string
          target_companies: string[]
          updated_at: string
        }
        Insert: {
          branch?: string | null
          college_id?: string | null
          created_at?: string
          full_name?: string | null
          graduation_year?: number | null
          id: string
          target_companies?: string[]
          updated_at?: string
        }
        Update: {
          branch?: string | null
          college_id?: string | null
          created_at?: string
          full_name?: string | null
          graduation_year?: number | null
          id?: string
          target_companies?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_college_fk"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      question_links: {
        Row: {
          college_id: string | null
          company_id: string | null
          created_at: string
          drive_id: string | null
          id: string
          question_id: string
          report_count: number
          role: string | null
          round: string | null
          year: number | null
        }
        Insert: {
          college_id?: string | null
          company_id?: string | null
          created_at?: string
          drive_id?: string | null
          id?: string
          question_id: string
          report_count?: number
          role?: string | null
          round?: string | null
          year?: number | null
        }
        Update: {
          college_id?: string | null
          company_id?: string | null
          created_at?: string
          drive_id?: string | null
          id?: string
          question_id?: string
          report_count?: number
          role?: string | null
          round?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "question_links_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_links_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_links_drive_id_fkey"
            columns: ["drive_id"]
            isOneToOne: false
            referencedRelation: "placement_drives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_links_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          answer: string | null
          category: Database["public"]["Enums"]["question_category"]
          confidence: number
          content_hash: string | null
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty"]
          explanation: string | null
          id: string
          options: Json | null
          primary_year: number | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          report_count: number
          role: string | null
          round: string | null
          search_tsv: unknown
          source_count: number
          subtopic: string | null
          title: string | null
          topic: string | null
          updated_at: string
          verification: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          answer?: string | null
          category?: Database["public"]["Enums"]["question_category"]
          confidence?: number
          content_hash?: string | null
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty"]
          explanation?: string | null
          id?: string
          options?: Json | null
          primary_year?: number | null
          question_text: string
          question_type?: Database["public"]["Enums"]["question_type"]
          report_count?: number
          role?: string | null
          round?: string | null
          search_tsv?: unknown
          source_count?: number
          subtopic?: string | null
          title?: string | null
          topic?: string | null
          updated_at?: string
          verification?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          answer?: string | null
          category?: Database["public"]["Enums"]["question_category"]
          confidence?: number
          content_hash?: string | null
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty"]
          explanation?: string | null
          id?: string
          options?: Json | null
          primary_year?: number | null
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          report_count?: number
          role?: string | null
          round?: string | null
          search_tsv?: unknown
          source_count?: number
          subtopic?: string | null
          title?: string | null
          topic?: string | null
          updated_at?: string
          verification?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      repositories: {
        Row: {
          companies_found: number
          created_at: string
          description: string | null
          discovery_query: string | null
          error: string | null
          full_name: string
          html_url: string | null
          id: string
          last_analyzed_at: string | null
          problems_found: number
          questions_found: number
          stars: number
          status: string
          topics: string[]
        }
        Insert: {
          companies_found?: number
          created_at?: string
          description?: string | null
          discovery_query?: string | null
          error?: string | null
          full_name: string
          html_url?: string | null
          id?: string
          last_analyzed_at?: string | null
          problems_found?: number
          questions_found?: number
          stars?: number
          status?: string
          topics?: string[]
        }
        Update: {
          companies_found?: number
          created_at?: string
          description?: string | null
          discovery_query?: string | null
          error?: string | null
          full_name?: string
          html_url?: string | null
          id?: string
          last_analyzed_at?: string | null
          problems_found?: number
          questions_found?: number
          stars?: number
          status?: string
          topics?: string[]
        }
        Relationships: []
      }
      source_records: {
        Row: {
          first_seen: string
          id: string
          last_seen: string
          problem_id: string | null
          question_id: string | null
          raw_excerpt: string | null
          source_id: string
        }
        Insert: {
          first_seen?: string
          id?: string
          last_seen?: string
          problem_id?: string | null
          question_id?: string | null
          raw_excerpt?: string | null
          source_id: string
        }
        Update: {
          first_seen?: string
          id?: string
          last_seen?: string
          problem_id?: string | null
          question_id?: string | null
          raw_excerpt?: string | null
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_records_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "coding_problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_records_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_records_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          commit_sha: string | null
          created_at: string
          id: string
          name: string
          reliability: number
          repo_full_name: string | null
          source_type: Database["public"]["Enums"]["source_type"]
          url: string | null
        }
        Insert: {
          commit_sha?: string | null
          created_at?: string
          id?: string
          name: string
          reliability?: number
          repo_full_name?: string | null
          source_type?: Database["public"]["Enums"]["source_type"]
          url?: string | null
        }
        Update: {
          commit_sha?: string | null
          created_at?: string
          id?: string
          name?: string
          reliability?: number
          repo_full_name?: string | null
          source_type?: Database["public"]["Enums"]["source_type"]
          url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_submissions: {
        Row: {
          college_name: string | null
          company_name: string | null
          content: string
          created_at: string
          id: string
          question_type: Database["public"]["Enums"]["question_type"]
          review_note: string | null
          role: string | null
          round: string | null
          status: Database["public"]["Enums"]["submission_status"]
          user_id: string
          year: number | null
        }
        Insert: {
          college_name?: string | null
          company_name?: string | null
          content: string
          created_at?: string
          id?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          review_note?: string | null
          role?: string | null
          round?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          user_id: string
          year?: number | null
        }
        Update: {
          college_name?: string | null
          company_name?: string | null
          content?: string
          created_at?: string
          id?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          review_note?: string | null
          role?: string | null
          round?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "student" | "moderator" | "admin" | "super_admin"
      difficulty: "easy" | "medium" | "hard"
      question_category:
        | "aptitude_quant"
        | "aptitude_logical"
        | "aptitude_verbal"
        | "technical"
        | "sql"
        | "coding"
        | "interview_technical"
        | "interview_hr"
        | "interview_managerial"
        | "interview_behavioral"
        | "case_study"
        | "other"
      question_type:
        | "mcq"
        | "multi_select"
        | "numerical"
        | "true_false"
        | "output_prediction"
        | "debugging"
        | "coding"
        | "sql"
        | "interview"
        | "subjective"
        | "case_study"
        | "communication"
      source_type:
        | "github"
        | "dataset"
        | "interview_experience"
        | "college_report"
        | "user_submission"
        | "admin_import"
        | "other"
      submission_status: "pending" | "approved" | "rejected" | "merged"
      verification_status:
        | "verified"
        | "candidate_reported"
        | "source_derived"
        | "unverified"
        | "ai_generated"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "moderator", "admin", "super_admin"],
      difficulty: ["easy", "medium", "hard"],
      question_category: [
        "aptitude_quant",
        "aptitude_logical",
        "aptitude_verbal",
        "technical",
        "sql",
        "coding",
        "interview_technical",
        "interview_hr",
        "interview_managerial",
        "interview_behavioral",
        "case_study",
        "other",
      ],
      question_type: [
        "mcq",
        "multi_select",
        "numerical",
        "true_false",
        "output_prediction",
        "debugging",
        "coding",
        "sql",
        "interview",
        "subjective",
        "case_study",
        "communication",
      ],
      source_type: [
        "github",
        "dataset",
        "interview_experience",
        "college_report",
        "user_submission",
        "admin_import",
        "other",
      ],
      submission_status: ["pending", "approved", "rejected", "merged"],
      verification_status: [
        "verified",
        "candidate_reported",
        "source_derived",
        "unverified",
        "ai_generated",
      ],
    },
  },
} as const
