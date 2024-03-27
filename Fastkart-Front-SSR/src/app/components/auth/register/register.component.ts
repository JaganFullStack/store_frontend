import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CustomValidators } from '../../../shared/validator/password-match';
import { Register } from '../../../shared/action/auth.action';
import { Breadcrumb } from '../../../shared/interface/breadcrumb';
import * as data from '../../../shared/data/country-code';
import { AuthService } from '../../../shared/services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  public form: FormGroup;
  registerErrorMsg = null;
  public breadcrumb: Breadcrumb = {
    title: "Sign In",
    items: [{ label: 'Sign In', active: true }]
  }
  public codes = data.countryCodes;
  public tnc = new FormControl(false, [Validators.requiredTrue]);

  constructor(
    private store: Store,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      CustomerName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
      country_code: new FormControl('91', [Validators.required]),
      Password: new FormControl('', [Validators.required]),
      password_confirmation: new FormControl('', [Validators.required]),
    }, { validator: CustomValidators.MatchValidator('Password', 'password_confirmation') });
  }

  get passwordMatchError() {
    return (
      this.form.getError('mismatch') &&
      this.form.get('password_confirmation')?.touched
    );
  }

  submit() {

    if (this.form.valid) {
      const reqData = {
        "name": this.form.get('CustomerName')!.value,
        "email": this.form.get('Email')!.value,
        "password": this.form.get('Password')!.value,
        "phone": this.form.get('Phone')!.value,
        "country_code": this.form.get('country_code')!.value,
      };

      this.store.dispatch(new Register(reqData));
    } else {
      // Form is invalid, display errors if needed
      console.log('Invalid form submission');
    }

  }
}
