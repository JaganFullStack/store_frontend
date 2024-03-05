import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngxs/store";
import { Router } from "@angular/router";
import { ForgotPassWord } from "../../../shared/action/auth.action";
import { Breadcrumb } from '../../../shared/interface/breadcrumb';
import { SharedModule } from "../../../shared/shared.module";

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

  constructor(private store: Store, 
    public router: Router, 
    public formBuilder: FormBuilder ) {
    this.form = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  submit() {
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
