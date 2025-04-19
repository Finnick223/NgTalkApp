import { FormControl } from '@angular/forms';
import { LoginFormControls } from '../../enums/form-controls/login-form-controls.enum';

export type LoginForm = {
  [LoginFormControls.EMAIL]: FormControl<string | null>;
  [LoginFormControls.PASSWORD]: FormControl<string | null>;
};
