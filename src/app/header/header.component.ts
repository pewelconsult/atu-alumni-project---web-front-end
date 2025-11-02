import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // ✅ Added CommonModule and RouterLinkActive
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  showUserMenu: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  /**
   * Toggle user dropdown menu
   */
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  /**
   * Close user menu
   */
  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  /**
   * Navigate to profile
   */
  goToProfile(): void {
    this.closeUserMenu();
    this.router.navigate(['/profile']);
  }

  /**
   * Navigate to settings
   */
  goToSettings(): void {
    this.closeUserMenu();
    this.router.navigate(['/settings']);
  }

  /**
   * Logout user
   */
  logout(): void {
    this.closeUserMenu();
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Clear session anyway and redirect
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Get user initials
   */
  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    const firstName = this.currentUser.first_name || '';
    const lastName = this.currentUser.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U';
  }
}