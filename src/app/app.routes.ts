import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NetworksComponent } from './networks/networks.component';
import { EventsComponent } from './events/events.component';
import { JobsComponent } from './jobs/jobs.component';
import { NewsComponent } from './news/news.component';
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
import { ForumTopicDetailComponent } from './forum-topic-detail/forum-topic-detail.component';
import { ForumComponent } from './forum/forum.component';
import { TracerPageComponent } from './tracer-page/tracer-page.component';
import { SuggestedNetworksComponent } from './suggested-networks/suggested-networks.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { AdminTracerComponent } from './admin/admin-tracer/admin-tracer.component';
import { CreateForumComponent } from './create-forum/create-forum.component';
import { loginRedirectGuard } from '../guards/login-redirect.guard';
import { authGuard } from '../guards/auth.guard';
import { adminGuard } from '../guards/admin.guard';



export const routes: Routes = [
  // Root redirect
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Auth routes (with login redirect guard)
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [loginRedirectGuard]
  },
  
  // Main application routes (protected by auth guard)
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'networks', 
    component: NetworksComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'events', 
    component: EventsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'events/:id', 
    component: EventDetailsComponent, 
    data: { prerender: false },
    canActivate: [authGuard]
  },
  { 
    path: 'news', 
    component: NewsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'news/:id', 
    component: NewsDetailsComponent, 
    data: { prerender: false },
    canActivate: [authGuard]
  },
  { 
    path: 'forum', 
    component: ForumComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'forum/posts/:id', 
    component: ForumTopicDetailComponent, 
    data: { prerender: false },
    canActivate: [authGuard]
  },
  { 
    path: 'messages', 
    component: MessagesComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'profile/:id', 
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'tracer', 
    component: TracerPageComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'notifications', 
    component: NotificationsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'suggested-networks', 
    component: SuggestedNetworksComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'createForum', 
    component: CreateForumComponent,
    canActivate: [authGuard]
  },
  
  // Job routes (protected by auth guard)
  { 
    path: 'jobs', 
    component: JobsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'jobs/:id', 
    component: JobDetailsComponent,
    canActivate: [authGuard]
  },
  
  // Admin routes (protected by admin guard)
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'users', 
    component: UsersComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'adminEvents', 
    component: AdminEventsComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'admin/create-event', 
    component: CreateEventComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'addUser', 
    component: AddUserComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'adminJob', 
    component: JobManagementComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'postJob', 
    component: PostJobComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'adminForum', 
    component: ForumManagementComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'adminTracer', 
    component: AdminTracerComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'adminNews', 
    component: NewsManagementComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'newsForm', 
    component: NewsFormComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'reports', 
    component: ReportsComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'settings', 
    component: SettingsComponent,
    canActivate: [adminGuard]
  },
  
  // Wildcard route
  { path: '**', redirectTo: '/home' }
];