import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-admin-events',
  imports: [SidebarComponent],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.scss'
})
export class AdminEventsComponent {

  constructor(private router: Router) {}

  navigateToCreateEvent() {
    this.router.navigate(['/createEvent']);
  }

}
