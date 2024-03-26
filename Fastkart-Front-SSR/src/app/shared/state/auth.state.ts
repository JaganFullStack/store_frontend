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
import { FailureResponse, SuccessResponse } from "../action/response.action";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PleaseLoginModalComponent } from "../components/widgets/please-login-modal/please-login-modal.component";
import { ClearCart } from "../action/cart.action";
import { ClearWishList } from "../action/wishlist.action";
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
    private notificationService: NotificationService, private modalService: NgbModal, private authService: AuthService) { }


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
          storeStringDataInLocalStorage("user_token", result?.data.authToken);
          storeStringDataInLocalStorage("user_id", result?.data.userId);
          this.router.navigate(["/home"]);
          const mockMessageObject = mockResponseData(result.messageobject);
          this.store.dispatch(new SuccessResponse(mockMessageObject));
          this.modalService.open(PleaseLoginModalComponent, { centered: true });
        },
        error: err => {
          const messageObject = mockResponseData(err.messageobject);
          this.store.dispatch(new FailureResponse(messageObject));
          this.modalService.open(PleaseLoginModalComponent, { centered: true });
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
          storeStringDataInLocalStorage("user_token", result?.data.token);
          storeStringDataInLocalStorage("user_id", result?.data.userId);
          this.router.navigate(["/home"]);
          const mockMessageObject = mockResponseData(result.messageobject);
          this.store.dispatch(new SuccessResponse(mockMessageObject));
          this.modalService.open(PleaseLoginModalComponent, { centered: true });
        },
        error: err => {
          const messageObject = mockResponseData(err.messageobject);
          this.store.dispatch(new FailureResponse(messageObject));
          this.modalService.open(PleaseLoginModalComponent, { centered: true });
          throw new Error(err?.error?.message);
        }
      }));
  }



  @Action(ForgotPassWord)


  forgetpasswordd(ctx: StateContext<AuthStateModel>, { payload }: ForgotPassWord) {

    console.log(payload);
    return this.authService.Emailvalidation(payload).pipe(

      tap({
        next: result => {
          this.router.navigate(['/auth/login']);
          const mockMessageObject = mockResponseData(result.messageobject);
          this.store.dispatch(new SuccessResponse(mockMessageObject));
          this.modalService.open(PleaseLoginModalComponent, { centered: true });
        },
        error: err => {
          const messageObject = mockResponseData(err.messageobject);
          this.store.dispatch(new FailureResponse(messageObject));
          this.modalService.open(PleaseLoginModalComponent, { centered: true });
          throw new Error(err?.error?.message);
        },
      })
    );

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
    this.router.navigate(["/home"]);
    this.store.dispatch(new AuthClear());
    this.store.dispatch(new ClearCart());
    this.store.dispatch(new ClearWishList());
    const mockMessageObject = mockResponseData({ message: "Logout Successfully", status: 200 });
    this.store.dispatch(new SuccessResponse(mockMessageObject));
    this.modalService.open(PleaseLoginModalComponent, { centered: true });
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
