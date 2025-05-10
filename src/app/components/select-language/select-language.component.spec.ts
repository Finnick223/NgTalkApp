import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLanguageComponent } from './select-language.component';
import { getTranslocoModule } from 'src/testing/transloco-testing.module';
import { provideMockLanguageConfig } from 'src/testing/language-config.mock';

describe('SelectLanguageComponent', () => {
  let component: SelectLanguageComponent;
  let fixture: ComponentFixture<SelectLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectLanguageComponent, getTranslocoModule()],
      providers: [provideMockLanguageConfig],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
