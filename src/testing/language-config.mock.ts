import { Provider } from '@angular/core';
import { LANGUAGE_CONFIG, LanguageConfig } from '@Configs/language.config';
import { Language } from '@Enums/language';

export const mockLanguageConfig: LanguageConfig = {
  defaultLanguage: Language.ENGLISH,
  availableLanguages: [Language.ENGLISH, Language.POLISH],
};

export const provideMockLanguageConfig: Provider = {
  provide: LANGUAGE_CONFIG,
  useValue: mockLanguageConfig,
};
