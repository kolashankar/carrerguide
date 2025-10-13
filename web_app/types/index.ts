export interface User {
  id: string;
  email: string;
  full_name: string;
  role?: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface Job {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  job_type: string;
  category: string;
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  description: string;
  skills: string[];
  qualifications: string[];
  responsibilities: string[];
  benefits?: string[];
  application_url: string;
  is_active: boolean;
  posted_at: string;
  created_at: string;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  internship_type: string;
  category: string;
  duration_months: number;
  stipend_min?: number;
  stipend_max?: number;
  stipend_currency?: string;
  description: string;
  skills: string[];
  qualifications: string[];
  learning_outcomes?: string[];
  responsibilities: string[];
  application_url: string;
  is_active: boolean;
  posted_at: string;
  created_at: string;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  provider_logo?: string;
  country: string;
  scholarship_type: string;
  education_level: string;
  field_of_study: string;
  amount_min?: number;
  amount_max?: number;
  amount_currency?: string;
  description: string;
  eligibility_criteria: string[];
  benefits: string[];
  application_process: string[];
  application_url: string;
  deadline: string;
  is_active: boolean;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  author_avatar?: string;
  tags: string[];
  category: string;
  cover_image?: string;
  read_time: number;
  is_published: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  total?: number;
  page?: number;
  limit?: number;
}
