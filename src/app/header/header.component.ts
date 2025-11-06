// src/app/shared/header/header.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notifications.service';
import { MessagingService } from '../../services/messaging.service';
import { User } from '../../models/user';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  showUserMenu: boolean = false;
  unreadNotificationCount = 0;
  unreadMessageCount = 0;
  
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private messagingService: MessagingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.loadNotificationStats();
          this.loadMessageStats();
          
          // Poll for updates every 30 seconds
          interval(30000)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.loadNotificationStats();
              this.loadMessageStats();
            });
        }
      });

    // Subscribe to unread counts
    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadNotificationCount = count;
      });

    this.messagingService.unreadMessageCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadMessageCount = count;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load notification stats
   */
  loadNotificationStats(): void {
    this.notificationService.getNotificationStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.notificationService.updateUnreadCount(response.data.total_unread);
          }
        },
        error: (error) => {
          console.error('Error loading notification stats:', error);
        }
      });
  }

  /**
   * Load message stats
   */
  loadMessageStats(): void {
    this.messagingService.getUnreadMessageCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => {
          console.error('Error loading message stats:', error);
        }
      });
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  goToProfile(): void {
    this.closeUserMenu();
    if (this.currentUser) {
      this.router.navigate(['/profile', this.currentUser.id]);
    }
  }

  goToSettings(): void {
    this.closeUserMenu();
    this.router.navigate(['/settings']);
  }

  logout(): void {
    this.closeUserMenu();
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    const firstName = this.currentUser.first_name || '';
    const lastName = this.currentUser.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U';
  }

  /**
   * Get full profile picture URL
   */
  getProfilePictureUrl(): string {
    const picturePath = this.currentUser?.profile_picture;
    
    // If no picture, return default
    if (!picturePath) {
      return 'assets/images/default-avatar.png';
    }
    
    // If it's already a full URL (starts with http/https), return as-is
    if (picturePath.startsWith('http://') || picturePath.startsWith('https://')) {
      return picturePath;
    }
    
    // For development, construct the full URL
    const backendUrl = 'http://localhost:8080';
    
    // If path starts with /api, use it directly
    if (picturePath.startsWith('/api')) {
      return `${backendUrl}${picturePath}`;
    }
    
    // If path starts with /uploads, add /api prefix
    if (picturePath.startsWith('/uploads')) {
      return `${backendUrl}/api${picturePath}`;
    }
    
    // Otherwise, add /api prefix
    return `${backendUrl}/api${picturePath}`;
  }

  /**
   * Check if user has profile picture
   */
  hasProfilePicture(): boolean {
    return !!(this.currentUser?.profile_picture);
  }
}