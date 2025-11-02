import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NetworksComponent } from './networks/networks.component';
import { EventsComponent } from './events/events.component';
import { JobsComponent } from './jobs/jobs.component';
import { NewsComponent } from './news/news.component';
import { ForumComponent } from './forum/forum.component';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UsersComponent } from './admin/users/users.component';
import { AdminEventsComponent } from './admin/admin-events/admin-events.component';
import { CreateEventComponent } from './admin/create-event/create-event.component';
import { AddUserComponent } from './admin/add-user/add-user.component';
import { JobManagementComponent } from './admin/job-management/job-management.component';
import { PostJobComponent } from './admin/post-job/post-job.component';
import { ForumManagementComponent } from './admin/forum-management/forum-management.component';
import { NewsManagementComponent } from './admin/news-management/news-management.component';
import { NewsFormComponent } from './admin/news-form/news-form.component';
import { LoginComponent } from './login/login.component'; 
import { EventDetailsComponent } from './event-details/event-details.component';
import { NewsDetailsComponent } from './news-details/news-details.component';

export const routes: Routes = [
  // Root redirect
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Auth routes
  { path: 'login', component: LoginComponent },
  
  // Main application routes
  { path: 'home', component: HomeComponent },
  { path: 'networks', component: NetworksComponent },
  { path: 'events', component: EventsComponent },
  { path: 'events/:id', component: EventDetailsComponent },
  { path: 'news', component: NewsComponent },
  { path: 'news/:id', component: NewsDetailsComponent },
  { path: 'forums', component: ForumComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'notifications', component: NotificationsComponent },
  
  // Job routes - IMPORTANT: Specific routes BEFORE parameterized routes
  { path: 'jobs', component: JobsComponent },
  { path: 'jobs/:id', component: JobDetailsComponent }, // ✅ Must be AFTER 'jobs' but BEFORE wildcard
  
  // Admin routes
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'adminEvents', component: AdminEventsComponent },
  { path: 'createEvent', component: CreateEventComponent },
  { path: 'addUser', component: AddUserComponent },
  { path: 'adminJob', component: JobManagementComponent },
  { path: 'postJob', component: PostJobComponent },
  { path: 'adminForum', component: ForumManagementComponent },
  { path: 'adminNews', component: NewsManagementComponent },
  { path: 'newsForm', component: NewsFormComponent },
  
  // Wildcard route - MUST BE LAST
  { path: '**', redirectTo: '/home' }
];