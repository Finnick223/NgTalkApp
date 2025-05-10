import { inject, Injectable } from '@angular/core';
import { LANGUAGE_CONFIG } from '@Configs/language.config';
import { Language } from '@Enums/language';
import { LocalStorageKeys } from '@Enums/local-storage-keys';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {
    this.initializeLanguage();
  }
  languageConfig = inject(LANGUAGE_CONFIG);

  //TODO rewrite it to signals style in future
  readonly languageSubject = new BehaviorSubject<Language>(
    this.languageConfig.defaultLanguage,
  );

  get language(): Language {
    return this.languageSubject.getValue();
  }

  set language(language: Language) {
    this.languageSubject.next(language);
    this.setLanguage(language);
  }

  private getLanguage(): Language | null {
    return localStorage.getItem(LocalStorageKeys.LANGUAGE) as Language | null;
  }
  private setLanguage(language: Language): void {
    localStorage.setItem(LocalStorageKeys.LANGUAGE, language);
  }
  private initializeLanguage(): void {
    this.language = this.getLanguage() ?? this.languageConfig.defaultLanguage;
  }
}
