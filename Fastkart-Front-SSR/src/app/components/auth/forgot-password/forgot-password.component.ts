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
      email: ["", [Validators.required, Validators.email]],
      password: ["",]

    });
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = this.form.value;

      this.store.dispatch(new ForgotPassWord(this.form.value))
    
    }
  }

}
