export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  other_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  student_id?: string;
  graduation_year?: number;
  program_of_study?: string;
  major?: string;
  faculty?: string;
  department?: string;
  current_company?: string;
  job_title?: string;
  industry?: string;
  years_of_experience?: number;
  current_city?: string;
  current_country?: string;
  hometown?: string;
  bio?: string;
  profile_picture?: string;
  cover_photo?: string;
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  website_url?: string;
  skills?: string[];
  interests?: string[];
  role: 'alumni' | 'admin' | 'staff';
  is_verified: boolean;
  is_active: boolean;
  email_verified: boolean;
  profile_visibility?: string;
  show_email?: boolean;
  show_phone?: boolean;
  last_login?: string;
  created_at: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  other_name?: string;
  phone_number?: string;
  role?: 'alumni' | 'admin' | 'staff';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}