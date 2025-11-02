import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-post-job',
  imports: [SidebarComponent],
  templateUrl: './post-job.component.html',
  styleUrl: './post-job.component.scss'
})
export class PostJobComponent implements OnInit {
  today: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.today = new Date().toISOString().split('T')[0];
  }

  navigateToJobManagement() {
    this.router.navigate(['/adminJob']);
  }

  addSkill() {
    const skillInput = document.getElementById('skillInput') as HTMLInputElement;
    const skillsContainer = document.getElementById('skillsContainer');

    if (skillInput && skillsContainer && skillInput.value.trim()) {
      const skillTag = document.createElement('span');
      skillTag.className = 'bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2';
      skillTag.innerHTML = `
        ${skillInput.value.trim()}
        <button type="button" class="text-white hover:text-red-300" onclick="this.parentElement.remove()">×</button>
      `;
      skillsContainer.appendChild(skillTag);
      skillInput.value = '';
    }
  }
}
