import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChatService } from './chat.service';
import { WebSocketService } from '@Services/http/web-socket/web-socket.service';
import { AuthTokenService } from '@Services/auth-token/auth-token.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { WebSocketStatus } from '@Enums/web-socket-status.enum';

describe('ChatService', () => {
  let service: ChatService;
  let mockWebSocketService: jasmine.SpyObj<WebSocketService>;
  let mockAuthTokenService: jasmine.SpyObj<AuthTokenService>;
  let mockActivatedRoute: any;

  // track msg
  let messagesSubject: Subject<any>;
  let statusSubject: BehaviorSubject<WebSocketStatus>;

  beforeEach(() => {
    // Create subjects for mock
    messagesSubject = new Subject<any>();
    statusSubject = new BehaviorSubject<WebSocketStatus>(
      WebSocketStatus.Connected,
    );

    // Create mock services
    mockWebSocketService = jasmine.createSpyObj(
      'WebSocketService',
      ['getMessages', 'sendMessage', 'closeConnection'],
      { status$: statusSubject.asObservable() },
    );

    mockWebSocketService.getMessages.and.returnValue(
      messagesSubject.asObservable(),
    );

    mockAuthTokenService = jasmine.createSpyObj('AuthTokenService', [
      'getUsernameFromToken',
    ]);
    mockAuthTokenService.getUsernameFromToken.and.returnValue('testUser');

    mockActivatedRoute = {
      queryParams: new BehaviorSubject({ conversationId: 'test-conversation' }),
    };

    TestBed.configureTestingModule({
      providers: [
        ChatService,
        { provide: WebSocketService, useValue: mockWebSocketService },
        { provide: AuthTokenService, useValue: mockAuthTokenService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get messages as an observable', () => {
    expect(service.messages$).toBeDefined();
  });

  it('should append new message to array when new is received', fakeAsync(() => {
    const testMessage = { content: 'Test message' };
    let messagesSnapshot: any[] = [];

    // Subscribe to capture msg changes
    const subscription = service.messages$.subscribe((messages) => {
      messagesSnapshot = messages;
    });

    // Emit new msg through mock
    messagesSubject.next(testMessage);
    tick();

    // Verify if msg was added
    expect(messagesSnapshot.length).toBe(1);
    expect(messagesSnapshot[0]).toEqual(testMessage);

    subscription.unsubscribe();
  }));

  it('should send message with correct data', fakeAsync(() => {
    const messageContent = 'Hello, world!';
    const currentDate = new Date();

    // Mock date for consistent testing
    jasmine.clock().install();
    jasmine.clock().mockDate(currentDate);

    service.sendMessage(messageContent);
    tick();

    // Check if service was called with expected message
    expect(mockWebSocketService.sendMessage).toHaveBeenCalledWith({
      authorId: 'testUser',
      conversationId: 'test-conversation',
      content: messageContent,
      timestamp: currentDate.toISOString(),
    });

    jasmine.clock().uninstall();
  }));

  it('should clear messages when WebSocket reconnects', fakeAsync(() => {
    let messagesSnapshot: any[] = [];

    // Subscribe msg changes
    const subscription = service.messages$.subscribe((messages) => {
      messagesSnapshot = messages;
    });

    // Emit test msg
    messagesSubject.next({ content: 'Message before reconnect' });
    tick();

    // Verify if msg added
    expect(messagesSnapshot.length).toBe(1);

    // Emit reconnected status
    statusSubject.next(WebSocketStatus.Reconnected);
    tick();

    // Verify msgs are cleared
    expect(messagesSnapshot.length).toBe(0);

    subscription.unsubscribe();
  }));

  it('should perform cleanup by closing connection', () => {
    service.cleanup();
    expect(mockWebSocketService.closeConnection).toHaveBeenCalled();
  });
});
