import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ForumPost, ForumCategory } from '../models/forum';
import { ApiResponse } from '../models/api-response';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = `${environment.apiUrl}/forums`;

  constructor(private http: HttpClient) {}

  /**
   * Get all forum categories
   */
  getAllCategories(): Observable<ApiResponse<ForumCategory[]>> {
    return this.http.get<ApiResponse<ForumCategory[]>>(`${this.apiUrl}/categories`);
  }

  /**
   * Get all posts with filters
   */
  getAllPosts(params?: {
    category_id?: number;
    is_pinned?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    current_user_id?: number;
  }): Observable<ApiResponse<ForumPost[]>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<ForumPost[]>>(`${this.apiUrl}/posts`, { params: httpParams });
  }

  /**
   * Get popular posts
   */
  getPopularPosts(page: number = 1, limit: number = 10): Observable<ApiResponse<ForumPost[]>> {
    return this.http.get<ApiResponse<ForumPost[]>>(`${this.apiUrl}/posts/popular`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  /**
   * Get trending posts
   */
  getTrendingPosts(page: number = 1, limit: number = 10): Observable<ApiResponse<ForumPost[]>> {
    return this.http.get<ApiResponse<ForumPost[]>>(`${this.apiUrl}/posts/trending`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  /**
   * Get single post by ID
   */
  getPostById(id: number, userId?: number): Observable<ApiResponse<ForumPost>> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('user_id', userId.toString());
    }
    return this.http.get<ApiResponse<ForumPost>>(`${this.apiUrl}/posts/${id}`, { params });
  }

  /**
   * Like post
   */
  likePost(postId: number, userId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/posts/${postId}/like`, { user_id: userId });
  }

  /**
   * Unlike post
   */
  unlikePost(postId: number, userId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/posts/${postId}/unlike`, {
      params: { user_id: userId.toString() }
    });
  }
}