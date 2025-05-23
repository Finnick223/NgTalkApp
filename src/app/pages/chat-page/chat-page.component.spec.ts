import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatPageComponent } from './chat-page.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { getTranslocoModule } from 'src/testing/transloco-testing.module';

describe('ChatPageComponent', () => {
  let component: ChatPageComponent;
  let fixture: ComponentFixture<ChatPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatPageComponent, getTranslocoModule()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ conversationId: 'test-id' }), // Mock queryParams
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
