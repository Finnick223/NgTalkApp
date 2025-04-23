import { Validators } from '@angular/forms';
import { RegisterFormControls } from '@Enums/form-controls/register-form-controls.enum';

export const RegisterFormValidators = {
  [RegisterFormControls.USERNAME]: [
    Validators.required,
    Validators.minLength(4),
  ],
  [RegisterFormControls.EMAIL]: [Validators.required, Validators.email],
  [RegisterFormControls.PASSWORD]: [
    Validators.required,
    Validators.minLength(4),
  ],
  [RegisterFormControls.PASSWORD_CONFIRM]: [Validators.required],
};
