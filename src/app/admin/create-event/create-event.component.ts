import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-create-event',
  imports: [SidebarComponent],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent {

  constructor(private router: Router) {}

  navigateBackToAdminEvents() {
    this.router.navigate(['/adminEvents']);
  }

}
