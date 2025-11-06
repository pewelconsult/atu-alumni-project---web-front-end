import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { TracerStudyResponse } from '../../models/tracer-study';
import { TracerStudyService } from '../../services/tracer-study.service';
import { ApiResponse } from '../../models/api-response';


@Component({
  selector: 'app-tracer-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tracer-page.component.html',
  styleUrl: './tracer-page.component.scss'
})
export class TracerPageComponent implements OnInit {
  currentUser: User | null = null;
  currentSection = 1;
  hasSubmitted = false;
  isLoading = false;
  isSubmitting = false;

  // Form data
  formData: TracerStudyResponse = {
    user_id: 0,
    full_name: '',
    index_number: '',
    programme_of_study: '',
    year_of_graduation: '',
    email: '',
    phone_number: '',
    current_status: ''
  };

  // Dropdown options
  programmes = [
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical/Electronic Engineering',
    'Automobile Engineering',
    'Computer Science',
    'Fashion Design and Textiles',
    'Business Administration',
    'Others'
  ];

  graduationYears = ['2020', '2021', '2022', '2023', '2024'];

  constructor(
    private tracerStudyService: TracerStudyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.updateStepIndicators(1);
    
    // Get current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.formData.user_id = user.id;
        this.formData.full_name = `${user.first_name} ${user.last_name}`;
        this.formData.email = user.email;
        
        // Check if user has already submitted
        this.checkSubmissionStatus();
      }
    });
  }

  /**
   * Check if user has already submitted
   */
  checkSubmissionStatus(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.tracerStudyService.checkSubmissionStatus(this.currentUser.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.hasSubmitted = response.data.has_submitted;
          
          if (this.hasSubmitted) {
            // Load their existing response
            this.loadMyResponse();
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error checking submission status:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Load user's existing response
   */
  loadMyResponse(): void {
    if (!this.currentUser) return;

    this.tracerStudyService.getMyResponse(this.currentUser.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.formData = response.data;
          alert('You have already submitted a response. You can view or update it here.');
        }
      },
      error: (error) => {
        console.error('Error loading response:', error);
      }
    });
  }

  /**
   * Show specific section
   */
  showSection(sectionNumber: number): void {
    // Validate current section before moving forward
    if (sectionNumber > this.currentSection && !this.validateSection(this.currentSection)) {
      alert('Please fill in all required fields before proceeding.');
      return;
    }

    // Hide all sections
    for (let i = 1; i <= 6; i++) {
      const section = document.getElementById(`section${i}`);
      if (section) section.style.display = 'none';
    }
    
    // Show current section
    const current = document.getElementById(`section${sectionNumber}`);
    if (current) current.style.display = 'block';
    this.currentSection = sectionNumber;

    // Update progress bar
    const progress = (this.currentSection / 6) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.width = `${progress}%`;
    
    const progressText = document.getElementById('progressText');
    if (progressText) progressText.textContent = `Step ${this.currentSection} of 6`;

    // Update step indicators
    this.updateStepIndicators(this.currentSection);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Validate section
   */
  validateSection(sectionNumber: number): boolean {
    switch (sectionNumber) {
      case 1:
        return !!(
          this.formData.full_name &&
          this.formData.index_number &&
          this.formData.programme_of_study &&
          this.formData.year_of_graduation &&
          this.formData.email &&
          this.formData.phone_number
        );
      case 2:
        return !!this.formData.current_status;
      case 3:
        // Employment section is optional unless employed/self-employed
        if (['Employed', 'Self-employed'].includes(this.formData.current_status)) {
          return !!(
            this.formData.job_title &&
            this.formData.employer_name &&
            this.formData.sector
          );
        }
        return true;
      default:
        return true;
    }
  }

  /**
   * Update step indicators
   */
  updateStepIndicators(currentStep: number): void {
    const indicators = document.querySelectorAll('.flex.flex-col.items-center');
    indicators.forEach((indicator, index) => {
      const circle = indicator.querySelector('div');
      const text = indicator.querySelector('span');

      if (index + 1 < currentStep) {
        // Completed step
        if (circle) {
          circle.classList.remove('bg-gray-300', 'text-gray-600', 'bg-primary');
          circle.classList.add('bg-green-500', 'text-white');
        }
        if (text) {
          text.classList.remove('text-gray-500', 'text-primary');
          text.classList.add('text-green-600', 'font-medium');
        }
      } else if (index + 1 === currentStep) {
        // Current step
        if (circle) {
          circle.classList.remove('bg-gray-300', 'text-gray-600', 'bg-green-500');
          circle.classList.add('bg-primary', 'text-white');
        }
        if (text) {
          text.classList.remove('text-gray-500', 'text-green-600');
          text.classList.add('text-primary', 'font-medium');
        }
      } else {
        // Future step
        if (circle) {
          circle.classList.remove('bg-primary', 'bg-green-500', 'text-white');
          circle.classList.add('bg-gray-300', 'text-gray-600');
        }
        if (text) {
          text.classList.remove('text-primary', 'text-green-600', 'font-medium');
          text.classList.add('text-gray-500');
        }
      }
    });
  }

  /**
   * Submit form
   */
  /**
 * Submit form
 */
onSubmit(): void {
  if (!this.currentUser) {
    this.showAlert('error', 'Please log in to submit the form.');
    return;
  }

  // Validate all required fields
  if (!this.validateSection(1) || !this.validateSection(2) || !this.validateSection(3)) {
    this.showAlert('error', 'Please fill in all required fields.');
    return;
  }

  this.isSubmitting = true;

  // Set completion flag
  this.formData.is_completed = true;

  this.tracerStudyService.submitResponse(this.formData).subscribe({
    next: (response: ApiResponse<TracerStudyResponse>) => {
      if (response.success) {
        // Show success alert
        this.showAlert('success', 'Your tracer study response has been successfully submitted! Thank you for your feedback.');
        
        // Hide form and show thank you message
        const form = document.getElementById('tracerForm');
        const thankYouMessage = document.getElementById('thankYouMessage');
        if (form) form.style.display = 'none';
        if (thankYouMessage) thankYouMessage.classList.remove('hidden');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      this.isSubmitting = false;
    },
    error: (error: any) => {
      console.error('Error submitting form:', error);
      if (error.error?.error) {
        this.showAlert('error', error.error.error);
      } else {
        this.showAlert('error', 'Failed to submit form. Please try again.');
      }
      this.isSubmitting = false;
    }
  });
}

/**
 * Show alert message
 */
showAlert(type: 'success' | 'error', message: string): void {
  // Create alert element
  const alertDiv = document.createElement('div');
  alertDiv.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md animate-slide-in ${
    type === 'success' 
      ? 'bg-green-500 text-white' 
      : 'bg-red-500 text-white'
  }`;
  
  alertDiv.innerHTML = `
    <div class="flex items-center space-x-3">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} text-2xl"></i>
      <div class="flex-1">
        <p class="font-medium">${type === 'success' ? 'Success!' : 'Error'}</p>
        <p class="text-sm opacity-90">${message}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(alertDiv);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentElement) {
      alertDiv.remove();
    }
  }, 5000);
}
}