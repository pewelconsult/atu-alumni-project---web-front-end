import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-users',
  imports: [SidebarComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // Ensure sidebar is rendered when component initializes
  }

  navigateToAddUser() {
    this.router.navigate(['/addUser']);
  }

}
