import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsArticle } from '../models/news';
import { ApiResponse } from '../models/api-response';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = `${environment.apiUrl}/news`;

  constructor(private http: HttpClient) {}

  /**
   * Get all news articles with filters
   */
  getAllArticles(params?: {
    category?: string;
    is_featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<NewsArticle[]>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<NewsArticle[]>>(this.apiUrl, { params: httpParams });
  }

  /**
   * Get featured articles
   */
  getFeaturedArticles(limit: number = 5): Observable<ApiResponse<NewsArticle[]>> {
    return this.http.get<ApiResponse<NewsArticle[]>>(`${this.apiUrl}/featured`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Get latest articles
   */
  getLatestArticles(limit: number = 10): Observable<ApiResponse<NewsArticle[]>> {
    return this.http.get<ApiResponse<NewsArticle[]>>(`${this.apiUrl}/latest`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Get popular articles
   */
  getPopularArticles(limit: number = 10): Observable<ApiResponse<NewsArticle[]>> {
    return this.http.get<ApiResponse<NewsArticle[]>>(`${this.apiUrl}/popular`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Get single article by ID
   */
  getArticleById(id: number, userId?: number): Observable<ApiResponse<NewsArticle>> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('user_id', userId.toString());
    }
    return this.http.get<ApiResponse<NewsArticle>>(`${this.apiUrl}/${id}`, { params });
  }

  /**
   * Increment view count
   */
  incrementViewCount(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${id}/view`, {});
  }

  /**
   * Like article
   */
  likeArticle(id: number, userId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${id}/like`, { user_id: userId });
  }

  /**
   * Unlike article
   */
  unlikeArticle(id: number, userId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}/unlike`, {
      params: { user_id: userId.toString() }
    });
  }
}