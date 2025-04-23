import { FormControl } from '@angular/forms';
import { RegisterFormControls } from '@Enums/form-controls/register-form-controls.enum';

export type RegisterForm = {
  [RegisterFormControls.USERNAME]: FormControl<string | null>;
  [RegisterFormControls.EMAIL]: FormControl<string | null>;
  [RegisterFormControls.PASSWORD]: FormControl<string | null>;
  [RegisterFormControls.PASSWORD_CONFIRM]: FormControl<string | null>;
};
