import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LANGUAGE_CONFIG_VALUE } from '@Configs/language.config';
import { Language } from '@Enums/language';
import { LanguageService } from '@Services/language/language.service';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-select-language',
  imports: [FormsModule, SelectModule, ButtonModule],
  templateUrl: './select-language.component.html',
  styleUrl: './select-language.component.css',
})
export class SelectLanguageComponent {
  private readonly languageService = inject(LanguageService);
  protected readonly selectedLanguage = signal<Language>(Language.ENGLISH);
  languages: Language[] = LANGUAGE_CONFIG_VALUE.availableLanguages;

  constructor() {
    this.selectedLanguage.set(this.languageService.language);
  }

  onChange(value: { value: Language }): void {
    this.languageService.language = value.value;
    window.location.reload();
  }
}
