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
    },{validator : CustomValidators.MatchValidator('Password', 'password_confirmation')});
  }

  get passwordMatchError() {
    return (
      this.form.getError('mismatch') &&
      this.form.get('password_confirmation')?.touched
    );
  }

  submit() {

    // console.log("FORM DATA",this.form.value); 

    if (this.form.valid) {
      const username = this.form.get('CustomerName')!.value;
      const email = this.form.get('Email')!.value;
      const password = this.form.get('Password')!.value;
      const mobile = this.form.get('Phone')!.value;

      const reqData={
        "CustomerName":username,
        "Email":email,
        "Password":password,
        "MobileNo":mobile
      }
      
      this.authService.registration(reqData).subscribe({
        next: (response: any) => {  
            
            console.log(response);
            // this.router.navigateByUrl('/account/dashboard');
        },
        error: (error) => {
          console.log("Api Error",error.error.messages.error);
        },  
      });
    } else {
      // Form is invalid, display errors if needed
      console.log('Invalid form submission');
    }
    

if(false){



    this.form.markAllAsTouched();
    if(this.tnc.invalid){
      return
    }
    if(this.form.valid) {
      this.store.dispatch(new Register(this.form.value)).subscribe({
          complete: () => {
            this.router.navigateByUrl('/account/dashboard');
          }
        }
      );
    }
  }

  }
}
