// register-page.component.ts
import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegisterPageService } from './register-page.service';
import { RegisterFormControls } from '@Enums/form-controls/register-form-controls.enum';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { RegisterForm } from '@Interfaces/forms/register-form.interface';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    InputTextModule,
    RouterModule,
    TranslocoModule,
  ],
  providers: [RegisterPageService],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  private readonly registerPageService = inject(RegisterPageService);
  protected readonly RegisterFormControls = RegisterFormControls;

  protected get registerForm(): FormGroup<RegisterForm> {
    return this.registerPageService.registerForm;
  }

  protected onSubmit(): void {
    return this.registerPageService.submitForm();
  }
}
