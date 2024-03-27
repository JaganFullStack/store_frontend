import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login } from '../../../shared/action/auth.action';
import { Breadcrumb } from '../../../shared/interface/breadcrumb';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {


  responseError: null;
  public form: FormGroup;
  public breadcrumb: Breadcrumb = {
    title: "Log in",
    items: [{ label: 'Log in', active: true }]
  }

  constructor(
    private store: Store,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  submit() {
    this.form.markAllAsTouched();
    // LOGIN NEW CODE 
    if (this.form.valid) {
      const email = this.form.get('email')!.value;
      const password = this.form.get('password')!.value;
      const userData = {
        "email": email,
        "password": password
      };
      this.store.dispatch(new Login(userData));
    } else {
      console.log('Invalid form submission');
    }
  }

}
