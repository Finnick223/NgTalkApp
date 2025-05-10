import { inject, Injectable } from '@angular/core';
import { Language } from '@Enums/language';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { LocalStorageService } from '@Services/local-storage/local-storage.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translocoService = inject(TranslocoService);
  private readonly localStorageService = inject(LocalStorageService);

  constructor() {
    this.subscribeToLangChanges();
  }

  get language(): Language {
    return this.localStorageService.language;
  }

  set language(value: Language) {
    this.localStorageService.language = value;
  }

  private async loadLanguage(language: Language): Promise<void> {
    await firstValueFrom(this.translocoService.load(language));
    this.translocoService.setActiveLang(language);
  }

  private subscribeToLangChanges(): void {
    this.localStorageService.languageSubject
      .pipe(takeUntilDestroyed())
      .subscribe((language) => {
        this.loadLanguage(language);
      });
  }
}
