import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { ApiResponse } from '../../models/api-response';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  loading = true;
  error: string | null = null;

  isEditing = false;
  editForm: Partial<User> = {};

  // Unsubscribe subject (same pattern as your other components)
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // EXACTLY SAME PATTERN AS HOME COMPONENT
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      if (user) {
        this.user = user;                    // Use cached user from AuthService
        this.editForm = { ...user };         // Copy for editing
        this.loading = false;
      } else {
        this.error = 'Please log in to view your profile';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing && this.user) {
      this.editForm = { ...this.user };
    }
  }

  saveProfile(): void {
    if (!this.user?.id) return;

    this.userService.updateUser(this.user.id, this.editForm).subscribe({
      next: (response: ApiResponse<User>) => {
        if (response.success && response.data) {
          // Update BOTH local user AND AuthService cache
          this.user = response.data;
          this.editForm = { ...response.data };
          this.authService.updateCurrentUser(response.data); // Update AuthService cache
          this.isEditing = false;
          alert('Profile updated successfully!');
        } else {
          alert(response.error || 'Failed to update profile');
        }
      },
      error: (err) => {
        console.error('Update error:', err);
        alert('Failed to update profile');
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  getInitials(): string {
    if (!this.user) return '??';
    const first = this.user.first_name?.[0] || '';
    const last = this.user.last_name?.[0] || '';
    return (first + last).toUpperCase();
  }

  getUserFullName(): string {
    if (!this.user) return 'User';
    return `${this.user.first_name} ${this.user.last_name}`.trim();
  }

  getUserGraduationInfo(): string {
    if (!this.user) return '';
    const program = this.user.program_of_study || 'Alumni';
    const year = this.user.graduation_year;
    return year ? `${program}, ${year}` : program;
  }
}