import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UpdatePassword } from '../../../shared/action/auth.action';
import { Breadcrumb } from '../../../shared/interface/breadcrumb';
import { AuthService } from '../../../shared/services/auth.service';
import { CustomValidators } from '../../../shared/validator/password-match';


@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
})
export class UpdatePasswordComponent {

  public registerErrorMsg =null;
  public form: FormGroup;
  public email: string;
  public token: any;
  public breadcrumb: Breadcrumb = {
    title: "Reset Password",
    items: [{ label: 'Reset Password', active: true }]
  }

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    public  router: Router,
    private authService: AuthService
  ) {

    
    this.email = this.store.selectSnapshot(state => state.auth.email);
    this.token = this.store.selectSnapshot(state => state.auth.token);

    this.form = this.formBuilder.group({
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },{validator : CustomValidators.MatchValidator('newPassword', 'confirmPassword')});

  }

  submit() {
    this.form.markAllAsTouched();

    let userEmailId = localStorage.getItem('ForgetEmailId');
    if (this.form.valid) {
      const email = userEmailId;
      const password = this.form.get('newPassword')!.value;
      const reqData={
        "Email":email,
        "Password":password,
      }
      
      this.authService.isUpdatedUserPassword(reqData).subscribe({
        next: (response: any) => {  
            this.registerErrorMsg=null;
            // this.router.navigateByUrl('/account/dashboard');
            const redirectUrl = this.authService.redirectUrl || '/account/dashboard';
            this.router.navigateByUrl(redirectUrl);
        },
        error: (error) => {
          this.registerErrorMsg=error.error.messages.error;
          console.log("Api Error",error.error.messages.error);
        },  
      });
    } else {
      // Form is invalid, display errors if needed
      console.log('Invalid form submission');
    }
   

    

    // if(this.form.valid) {
    if(false) {
      this.store.dispatch(
          new UpdatePassword({
            email: this.email,
            token: this.token,
            password: this.form.value.newPassword,
            password_confirmation: this.form.value.confirmPassword,
          })
      ).subscribe(
        {
          complete: () => { 
            this.router.navigateByUrl('/auth/login'); 
          }     
        }
      );
    }
  }

}
