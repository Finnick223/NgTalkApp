import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { Subscription } from 'rxjs';
import { ChatService } from '@Services/chat/chat.service';
import { ConversationMessageWithFlag } from '@Interfaces/conversation-message.interface';
import { AuthTokenService } from '@Services/auth-token/auth-token.service';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
@Component({
  selector: 'app-landing-page',
  imports: [
    CommonModule,
    FormsModule,
    AvatarModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    ScrollPanelModule,
    TranslocoModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
  conversationId = '';

  constructor(private router: Router) {}

  goToChat() {
    if (this.conversationId.trim()) {
      this.router.navigate(['/chat'], {
        queryParams: { conversationId: this.conversationId.trim() },
      });
    }
  }
}
