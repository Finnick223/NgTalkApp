import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';
import { provideMockLanguageConfig } from 'src/testing/language-config.mock';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockLanguageConfig],
    });
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
