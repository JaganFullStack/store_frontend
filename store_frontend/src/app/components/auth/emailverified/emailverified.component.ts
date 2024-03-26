import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngxs/store";
import { Router } from "@angular/router";
import { ForgotPassWord } from "../../../shared/action/auth.action";
import { Breadcrumb } from '../../../shared/interface/breadcrumb';
import { SharedModule } from "../../../shared/shared.module";
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
    selector: 'app-emailverified',
    
    templateUrl: './emailverified.component.html',
    styleUrl: './emailverified.component.scss',
})
export class EmailverifiedComponent {

  public form: FormGroup;
  public breadcrumb: Breadcrumb = {
    title: "Forgot Password",
    items: [{ label: 'Forgot Password', active: true }]
  }
  token: string;

  constructor(  private route: ActivatedRoute,private store: Store, 
    public router: Router, 
    public formBuilder: FormBuilder,private authService: AuthService ) 
    {
      this.token = this.route.snapshot.queryParams['token'];

    this.form = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  submit() {
      this.authService.verificationEmail(this.token).subscribe({
        next: (response: any) => {  
            localStorage.setItem('AuthToken', response?.token);
            localStorage.setItem('UserEmail',response?.Email)
            // this.registerErrorMsg=null;
            this.router.navigateByUrl('/account/dashboard');
            // this.router.navigateByUrl('/auth/emailverified');
        },
        error: (error) => {
          // this.registerErrorMsg=error.error.messages.error;
          console.log("Api Error",error.error.messages.error);
        },  
      });
    if(false){
    this.form.markAllAsTouched();
    if(this.form.valid) {
      this.store.dispatch(new ForgotPassWord(this.form.value)).subscribe({
        complete: () => { 
          this.router.navigateByUrl('/auth/otp'); 
        }     
      });
    }

  }
  }

}
