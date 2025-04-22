import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './web-socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WebSocketService,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ conversationId: 'mock-id' }),
            snapshot: {
              queryParams: { conversationId: 'mock-id' },
            },
          },
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
      ],
    });

    service = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
