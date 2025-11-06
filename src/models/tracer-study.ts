export interface TracerStudyResponse {
  id?: number;
  user_id: number;
  
  // Section 1: Personal Information
  full_name: string;
  index_number: string;
  programme_of_study: string;
  year_of_graduation: string;
  email: string;
  phone_number: string;
  
  // Section 2: Current Status
  current_status: string;
  time_to_first_job?: string;
  main_challenge?: string;
  
  // Section 3: Employment
  job_title?: string;
  employer_name?: string;
  sector?: string;
  job_related_to_field?: string;
  monthly_income_range?: string;
  how_found_job?: string;
  job_level?: string;
  
  // Section 4: Skills
  skills_relevance_rating?: number;
  skills_to_strengthen?: string;
  job_satisfaction_rating?: number;
  
  // Section 5: Feedback
  programme_quality_rating?: string;
  internship_support_satisfaction?: string;
  would_recommend_atu?: string;
  
  // Section 6: Alumni Engagement
  is_alumni_member?: boolean;
  willing_to_mentor?: boolean;
  preferred_contact_method?: string;
  willing_to_collaborate?: boolean;
  
  is_completed?: boolean;
  submitted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TracerStudyAnalytics {
  overview: {
    total_responses: number;
    employed_count: number;
    self_employed_count: number;
    unemployed_count: number;
    further_studies_count: number;
    employment_rate: number;
    avg_skills_relevance: number;
    avg_job_satisfaction: number;
    avg_programme_quality: number;
  };
  employment_by_programme: Array<{
    programme_of_study: string;
    total_responses: number;
    employed_count: number;
    employment_rate: number;
  }>;
  employment_by_sector: Array<{
    sector: string;
    count: number;
  }>;
  time_to_employment: Array<{
    time_to_first_job: string;
    count: number;
  }>;
  job_relevance: Array<{
    job_related_to_field: string;
    count: number;
  }>;
  income_distribution: Array<{
    monthly_income_range: string;
    count: number;
  }>;
  responses_by_year: Array<{
    year_of_graduation: string;
    count: number;
  }>;
  main_challenges: Array<{
    main_challenge: string;
    count: number;
  }>;
}