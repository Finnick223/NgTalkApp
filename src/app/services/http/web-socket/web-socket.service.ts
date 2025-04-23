import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Subject, Observable, timer, BehaviorSubject } from 'rxjs';
import { ENVIRONMENT } from '@Environments/environment.development';
import { catchError } from 'rxjs/operators';
import { WebSocketStatus } from '@Enums/web-socket-status.enum';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocketSubject<any> | null = null;
  private messagesSubject$ = new Subject<any>();
  private statusSubject$ = new BehaviorSubject<WebSocketStatus>(
    WebSocketStatus.Connected,
  );
  status$ = this.statusSubject$.asObservable();
  private reconnectInterval = 3000; // 3 seconds

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      const conversationId = params['conversationId'];
      if (conversationId) {
        this.connect(conversationId);
      }
    });
  }

  private connect(conversationId: string) {
    this.socket$ = webSocket({
      url: `${ENVIRONMENT.websocket_url}?conversationId=${conversationId}`,
    });

    this.socket$
      .pipe(
        catchError(() => {
          // console.error('WebSocket err:', err);
          this.reconnect(conversationId);
          return [];
        }),
      )
      .subscribe({
        next: (msg) => this.messagesSubject$.next(msg),
        error: () => {
          // console.error('WS subscription err:', err);
          this.statusSubject$.next(WebSocketStatus.Disconnected);
        },
        complete: () => {
          // console.warn('WS connection completed');
          this.statusSubject$.next(WebSocketStatus.Disconnected);
        },
      });
    this.statusSubject$.next(WebSocketStatus.Reconnected);
  }

  private reconnect(conversationId: string) {
    this.socket$ = null;
    timer(this.reconnectInterval).subscribe(() => this.connect(conversationId));
  }

  sendMessage(message: any) {
    if (this.socket$) {
      this.socket$.next(message);
    } else {
      console.warn('WS not connected. Message not sent:', message);
    }
  }

  getMessages(): Observable<any> {
    return this.messagesSubject$.asObservable();
  }

  closeConnection() {
    this.socket$?.complete();
    this.socket$ = null;
  }
}
