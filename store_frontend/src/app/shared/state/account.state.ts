import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";

import { catchError,  } from 'rxjs/operators';
import { throwError } from 'rxjs';

import {
  GetUserDetails, UpdateUserProfile, UpdateUserPassword,
  CreateAddress, UpdateAddress, DeleteAddress, AccountClear, forgetpasssword
} from "../action/account.action";
import { AccountUser, AccountUserUpdatePassword } from "./../interface/account.interface";
import { AccountService } from "../services/account.service";
import { NotificationService } from "../services/notification.service";
import { Permission } from "../interface/role.interface";
import { Router } from "@angular/router";
import { mockResponseData } from "src/app/utilities/helper";

export class AccountStateModel {
  user: AccountUser | null;
  permissions: Permission[];
}

@State<AccountStateModel>({
  name: "account",
  defaults: {
    user: null,
    permissions: []
  },
})
@Injectable()
export class AccountState {

  constructor(private accountService: AccountService, private router: Router,private store:Store) { }

  @Selector()
  static user(state: AccountStateModel) {
    return state.user;
  }

  @Selector()
  static permissions(state: AccountStateModel) {
    return state.permissions;
  }

  @Action(GetUserDetails)
  getUserDetails(ctx: StateContext<AccountStateModel>) {
    return this.accountService.getUserDetails().pipe(
      tap({
        next: result => {
          ctx.patchState({
            user: result?.data[0],
            permissions: [],
          });
        },
        error: err => {
          const messageObject = mockResponseData(err.messageobject);
          // alert(messageObject?.message);
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateUserProfile)
  updateProfile(ctx: StateContext<AccountStateModel>, { payload }: UpdateUserProfile) {
    // Update Profile Logic Here
  }



  @Action(UpdateUserPassword)
updatePassword(ctx: StateContext<any>, { payload }: UpdateUserPassword) {
  console.log(payload);
  return this.accountService.UpdateUserPassword(payload).pipe(
   
    tap({
      next: result => {
        console.log("Update password success", result);
      
      },
      error: err => {
        console.log("Update password error", err);
        throw new Error(err?.error?.message);
      },
    })
  );
}

  @Action(CreateAddress)
  createAddress(ctx: StateContext<AccountStateModel>, action: CreateAddress) {
    // Create Address Logic Here
    return this.accountService.UpdateUserPassword(action.payload).pipe(
      tap({
        next: result => {
          this.store.dispatch(new GetUserDetails());
        },
        error: err => {
          const messageObject = mockResponseData(err.messageobject);
          // alert(messageObject?.message);
          throw new Error(err?.error?.message);
        }
      })
    );
  }


  @Action(DeleteAddress)
  deleteAddress(ctx: StateContext<AccountStateModel>, action: DeleteAddress) {
    // Delete Address Logic Here
  }

  @Action(DeleteAddress)
  forgetPassword(ctx: StateContext<AccountStateModel>, action: DeleteAddress) {
  
  }



  @Action(AccountClear)
  accountClear(ctx: StateContext<AccountStateModel>) {
    ctx.patchState({
      user: null,
      permissions: []
    });
    // alert("Logout Successfully");
  }

}