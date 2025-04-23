import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { RegisterFormValidators } from '@Configs/form-validators/register-form-validators.config';
import { RegisterFormControls } from '@Enums/form-controls/register-form-controls.enum';
import { RegisterForm } from '@Interfaces/forms/register-form.interface';
import { RegisterPayload } from '@Interfaces/payloads/auth/register-payload.interface';
import { AuthService } from '@Services/http/auth/auth.service';
import { RoutingService } from '@Services/routing/routing.service';
import { ToastService } from '@Services/toast/toast.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterPageService {
  readonly registerForm: FormGroup<RegisterForm> = this.initializeForm();
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly routingService = inject(RoutingService);

  initializeForm(): FormGroup<RegisterForm> {
    const form = new FormGroup<RegisterForm>({
      [RegisterFormControls.USERNAME]: new FormControl(null, {
        validators: RegisterFormValidators[RegisterFormControls.USERNAME],
      }),
      [RegisterFormControls.EMAIL]: new FormControl(null, {
        validators: RegisterFormValidators[RegisterFormControls.EMAIL],
      }),
      [RegisterFormControls.PASSWORD]: new FormControl(null, {
        validators: RegisterFormValidators[RegisterFormControls.PASSWORD],
      }),
      [RegisterFormControls.PASSWORD_CONFIRM]: new FormControl(null, {
        validators:
          RegisterFormValidators[RegisterFormControls.PASSWORD_CONFIRM],
      }),
    });
    form.addValidators(this.passwordMatchValidator());
    return form;
  }

  // Custom validator to check if passwords match
  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(RegisterFormControls.PASSWORD);
      const passwordConfirm = control.get(
        RegisterFormControls.PASSWORD_CONFIRM,
      );

      if (
        password &&
        passwordConfirm &&
        password.value !== passwordConfirm.value
      ) {
        passwordConfirm.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }

      return null;
    };
  }

  submitForm(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValues = this.registerForm.getRawValue();

    const payload: RegisterPayload = {
      username: formValues.username!,
      email: formValues.email!,
      password: formValues.password!,
    };

    this.authService
      .register(payload)
      .pipe(
        tap({
          next: () => {
            this.toastService.success(
              'Registration successful',
              'Your account has been created',
            );
            this.routingService.navigateToLogin();
          },
          error: (err) => {
            this.toastService.error(
              'Registration failed',
              err.error?.message ?? 'Please try again',
            );
          },
        }),
      )
      .subscribe();
  }
}
