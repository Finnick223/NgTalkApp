import { TestBed } from '@angular/core/testing';

import { LanguageService } from './language.service';
import { getTranslocoModule } from 'src/testing/transloco-testing.module';
import { provideMockLanguageConfig } from 'src/testing/language-config.mock';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      providers: [provideMockLanguageConfig],
    });
    service = TestBed.inject(LanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
