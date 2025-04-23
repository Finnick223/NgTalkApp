import { Routes } from '@angular/router';
import { authGuard } from '@Guards/auth/auth.guard';
import { ChatPageComponent } from '@Pages/chat-page/chat-page.component';
import { MainLayoutComponent } from '@Layouts/main-layout/main-layout.component';
import { LandingPageComponent } from '@Pages/landing-page/landing-page.component';
import { conversationGuard } from '@Guards/conversation/conversation.guard';

export const app_routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [
      { path: '', component: LandingPageComponent },
      {
        path: 'chat',
        canActivate: [conversationGuard],
        component: ChatPageComponent,
      },
    ],
  },
];
