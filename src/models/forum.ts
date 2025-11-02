export interface ForumPost {
  id: number;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  user_id: number;
  author_name?: string;
  author_picture?: string;
  title: string;
  content: string;
  slug: string;
  tags?: string[];
  views_count: number;
  replies_count: number;
  likes_count: number;
  user_has_liked?: boolean;
  is_pinned: boolean;
  is_locked: boolean;
  is_published: boolean;
  last_activity_at: string;
  created_at: string;
}

export interface ForumCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  posts_count: number;
  is_active: boolean;
}