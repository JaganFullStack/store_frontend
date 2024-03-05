import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngxs/store";
import { Router } from "@angular/router";
import { ForgotPassWord } from "../../../shared/action/auth.action";
import { Breadcrumb } from '../../../shared/interface/breadcrumb';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent {

  public responseError=null;
  public form: FormGroup;
  public breadcrumb: Breadcrumb = {
    title: "Forgot Password",
    items: [{ label: 'Forgot Password', active: true }]
  }

  constructor(private store: Store, 
    public router: Router, 
    public formBuilder: FormBuilder,private authService: AuthService  ) {
    this.form = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  submit() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const EmailId = this.form.get('email')!.value; 
    try {
      
        this.authService.Emailvalidation(EmailId).subscribe({
          next: (response: any) => {  
            this.responseError=null;
              
              console.log(response);
              localStorage.setItem('ForgetEmailId',EmailId);
              this.router.navigateByUrl('/auth/update-password');
             
          },
          error: (error) => {
            this.responseError=  error?.error?.message?? 'INVAILD EMAILID ';
            console.log("Api Error",error);
          },  
        });
    } catch (Error: any) {
      console.log("catch Error",Error);
    }
  } else {
    // Form is invalid, display errors if needed
    console.log('Invalid form submission');
  }


    

    // if(this.form.valid) {
    if(false) {
      this.store.dispatch(new ForgotPassWord(this.form.value)).subscribe({
        complete: () => { 
          this.router.navigateByUrl('/auth/update-password'); 
        }     
      });
    }
  }

}
