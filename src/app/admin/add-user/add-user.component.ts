import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-add-user',
  imports: [SidebarComponent],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {

  constructor(private router: Router) {}

  navigateBackToUsers() {
    this.router.navigate(['/users']);
  }

}
