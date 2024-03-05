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


  responseError:null;
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
      email: new FormControl('john.customer@example.com', [Validators.required, Validators.email]),
      password: new FormControl('123456789', [Validators.required]),
    });
  }

  submit() {
    this.form.markAllAsTouched();
          // LOGIN NEW CODE 
          if (this.form.valid) {
            const username = this.form.get('email')!.value; 
            const password = this.form.get('password')!.value;
          try {
            const userddata={
              "Email":username,
              "Password":password
            };
              this.authService.login(userddata).subscribe({
                next: (response: any) => {  
                  this.responseError=null;
                    
                    console.log(response);

                    localStorage.setItem('AuthToken', response?.token);
                    localStorage.setItem('UserEmail',response?.Email)

                    const redirectUrl = this.authService.redirectUrl || '/account/dashboard';
                    this.router.navigateByUrl(redirectUrl);
                   
                },
                error: (error) => {
                  this.responseError=  error?.error?.messages?.error ?? 'INVAILD EMAILID OR PASSWORD';
                  console.log("Api Error",error.error.messages.error);
                },  
              });
          } catch (Error: any) {
            console.log("catch Error",Error);
          }
        } else {
          // Form is invalid, display errors if needed
          console.log('Invalid form submission');
        }
          // END OF LOGIN CODE 
          // Navigate to the intended URL after successful login
          // AuthLogin
          // const redirectUrl = this.authService.redirectUrl || '/account/dashboard';
        
          // this.router.navigateByUrl(redirectUrl);

          // Clear the stored redirect URL
          // this.authService.redirectUrl = undefined; 
  }

}
