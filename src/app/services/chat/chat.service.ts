import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketStatus } from '@Enums/web-socket-status.enum';
import { AuthTokenService } from '@Services/auth-token/auth-token.service';
import { WebSocketService } from '@Services/http/web-socket/web-socket.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private messageSubscription: Subscription;

  constructor(
    private webSocketService: WebSocketService,
    private authTokenService: AuthTokenService,
    private route: ActivatedRoute,
  ) {
    // Subscribe msgs when service is created
    this.messageSubscription = this.webSocketService
      .getMessages()
      .subscribe((message) => {
        const currentMessages = this.messagesSubject.value;
        this.messagesSubject.next([...currentMessages, message]);
      });

    this.webSocketService.status$.subscribe((status) => {
      if (status === WebSocketStatus.Reconnected) {
        this.messagesSubject.next([]); // Clear msg history on reconnect
      }
    });
  }

  sendMessage(content: string) {
    this.route.queryParams.subscribe((params) => {
      const message = {
        authorId: this.authTokenService.getUsernameFromToken(),
        conversationId: params['conversationId'],
        content,
        timestamp: new Date().toISOString(),
      };
      this.webSocketService.sendMessage(message);
    });
  }

  cleanup() {
    this.webSocketService.closeConnection();
    this.messageSubscription.unsubscribe();
  }
}
