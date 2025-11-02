export interface ApiResponse<T = any> {
  total: number;
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}