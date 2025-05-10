import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginPageService } from './login-page.service';
import { LoginFormControls } from '@Enums/form-controls/login-form-controls.enum';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { LoginForm } from '@Interfaces/forms/login-form.interface';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    RouterModule,
    TranslocoModule,
  ],
  providers: [LoginPageService],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private readonly LoginPageService = inject(LoginPageService);
  protected readonly LoginFormControls = LoginFormControls;

  protected get loginForm(): FormGroup<LoginForm> {
    return this.LoginPageService.loginForm;
  }

  protected onSubmit(): void {
    return this.LoginPageService.submitForm();
  }
}
