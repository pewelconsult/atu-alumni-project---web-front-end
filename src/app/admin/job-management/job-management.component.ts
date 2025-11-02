import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-job-management',
  imports: [SidebarComponent],
  templateUrl: './job-management.component.html',
  styleUrl: './job-management.component.scss'
})
export class JobManagementComponent {

  constructor(private router: Router) {}

  navigateToPostJob() {
    this.router.navigate(['/postJob']);
  }

}
