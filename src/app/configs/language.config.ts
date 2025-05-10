import { InjectionToken } from '@angular/core';
import { Language } from '@Enums/language';

export interface LanguageConfig {
  defaultLanguage: Language;
  availableLanguages: Language[];
}

export const LANGUAGE_CONFIG = new InjectionToken<LanguageConfig>(
  'language.config',
);

export const LANGUAGE_CONFIG_VALUE: LanguageConfig = {
  defaultLanguage: Language.ENGLISH,
  availableLanguages: [Language.ENGLISH, Language.POLISH],
};
