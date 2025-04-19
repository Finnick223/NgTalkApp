import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginFormValidators } from '@Configs/form-validators/login-form-validators.config';
import { LoginFormControls } from '@Enums/form-controls/login-form-controls.enum';
import { LoginForm } from '@Interfaces/forms/login-form.interface';
import { LoginPayload } from '@Interfaces/payloads/auth/login-payload.interface';
import { LoginResponse } from '@Interfaces/responses/auth/login-response.interface';
import { AuthTokenService } from '@Services/auth-token/auth-token.service';
import { AuthService } from '@Services/http/auth/auth.service';
import { RoutingService } from '@Services/routing/routing.service';
import { ToastService } from '@Services/toast/toast.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginPageService {
  readonly loginForm: FormGroup<LoginForm> = this.initializeForm();
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly routingService = inject(RoutingService);
  private readonly tokenService = inject(AuthTokenService);

  initializeForm(): FormGroup<LoginForm> {
    return new FormGroup<LoginForm>({
      [LoginFormControls.EMAIL]: new FormControl(null, {
        validators: LoginFormValidators[LoginFormControls.EMAIL],
      }),
      [LoginFormControls.PASSWORD]: new FormControl(null, {
        validators: LoginFormValidators[LoginFormControls.PASSWORD],
      }),
    });
  }

  submitForm(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const payload: LoginPayload = this.loginForm.getRawValue();

    this.authService
      .login(payload)
      .pipe(
        tap({
          next: (response: LoginResponse) => {
            this.tokenService.storeToken(response.token);
            this.toastService.success('Logged in', 'successfully logged in');
            this.routingService.navigateToLandingPage();
          },
          error: (err) => {
            this.toastService.error('Login failed', err.error?.message ?? 'Please try again');
          },
        }),
      )
      .subscribe();
  }
}
