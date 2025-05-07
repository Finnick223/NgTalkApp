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
import { ActivatedRoute } from '@angular/router';
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
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css',
})
export class ChatPageComponent implements OnInit, OnDestroy {
  conversationId: string | undefined;
  constructor(
    private chatService: ChatService,
    private authTokenService: AuthTokenService,
    private route: ActivatedRoute,
  ) {}
  private chatSubscription: Subscription = new Subscription();
  messages: ConversationMessageWithFlag[] = [];
  newMessage = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.conversationId = params['conversationId'] || null;
    });

    this.chatSubscription = this.chatService.messages$.subscribe((msgs) => {
      this.messages = msgs.map((message) => ({
        ...message,
        isSentByMe:
          message.authorId === this.authTokenService.getUsernameFromToken(),
      }));

      setTimeout(() => this.scrollToBottom(), 0);
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage.trim());
      this.newMessage = '';
    }
  }

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  scrollToBottom() {
    const container = this.chatContainer?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  ngOnDestroy(): void {
    this.chatService.cleanup();
    this.chatSubscription.unsubscribe();
  }
}
