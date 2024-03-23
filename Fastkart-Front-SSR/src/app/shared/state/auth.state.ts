import { Injectable } from "@angular/core";
import { Store, State, Selector, Action, StateContext } from "@ngxs/store";
import { Router } from '@angular/router';
import { AccountClear, GetUserDetails } from "../action/account.action";
import { Register, Login, ForgotPassWord, VerifyEmailOtp, UpdatePassword, Logout, AuthClear } from "../action/auth.action";
import { NotificationService } from "../services/notification.service";
import { AuthService } from "../services/auth.service";
import { getStringDataFromLocalStorage, mockResponseData, removeDataFromLocalStorage, storeStringDataInLocalStorage } from "src/app/utilities/helper";
import { AccountStateModel } from "./account.state";
import { error } from "node:console";
import { tap } from "rxjs";
export interface AuthStateModel {
  email: String;
  token: String | Number;
  access_token: String | null;
}

@State<AuthStateModel>({
  name: "auth",
  defaults: {
    email: '',
    token: '',
    access_token: ''
  },
})
@Injectable()
export class AuthState {

  constructor(private store: Store, public router: Router,
    private notificationService: NotificationService, private authService: AuthService) { }


  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    // Pre Fake Login (if you are using ap
    ctx.patchState({
      email: '',
      token: '',
      access_token: ''
    })
  }

  @Selector()
  static accessToken(state: AuthStateModel): String | null {
    return state.access_token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): Boolean {
    return !!state.access_token;
  }

  @Selector()
  static email(state: AuthStateModel): String {
    return state.email;
  }

  @Selector()
  static token(state: AuthStateModel): String | Number {
    return state.token;
  }

  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, action: Register) {
    // Register Logic Here
    return this.authService.registration(action.payload).pipe(
      tap({
        next: result => {
          storeStringDataInLocalStorage("user_token", result.authToken);
          storeStringDataInLocalStorage("user_id", result.user_id);
          this.router.navigate(["/home"]);
          const mockMessageObject=mockResponseData(result.messageobject);
          alert(mockMessageObject?.message);
        },
        error: err => {
          const messageObject = mockResponseData(err.messageobject);
          alert(messageObject?.message);
          throw new Error(err?.error?.message);
        }
      }));
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    // Login Logic Here
    return this.authService.login(action.payload).pipe(
      tap({
        next: result => {
          storeStringDataInLocalStorage("user_token", result.token);
          storeStringDataInLocalStorage("user_id", result.user_id);
          this.router.navigate(["/home"]);
          const mockMessageObject=mockResponseData(result.messageobject);
          alert(mockMessageObject?.message);
        },
        error: err => {
          const messageObject = mockResponseData(err.messageobject);
          alert(messageObject?.message);
          throw new Error(err?.error?.message);
        }
      }));
  }

  @Action(ForgotPassWord)
  forgotPassword(ctx: StateContext<AuthStateModel>, action: ForgotPassWord) {
    // Forgot Password Logic Here
  }

  @Action(VerifyEmailOtp)
  verifyEmail(ctx: StateContext<AuthStateModel>, action: VerifyEmailOtp) {
    // Verify Logic Here
  }

  @Action(UpdatePassword)
  updatePassword(ctx: StateContext<AuthStateModel>, action: UpdatePassword) {
    // Update Password Logic Here
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    // Logout LOgic Here
    this.store.dispatch(new AuthClear());
  }

  @Action(AuthClear)
  authClear(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      email: '',
      token: '',
      access_token: null,
    });
    removeDataFromLocalStorage("user_token");
    removeDataFromLocalStorage("user_id");
    this.store.dispatch(new AccountClear());
  }

}
