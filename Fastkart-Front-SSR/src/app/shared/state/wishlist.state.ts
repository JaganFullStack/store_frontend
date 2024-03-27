import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { tap } from "rxjs";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { Product } from "../interface/product.interface";
import { AddOrRemoveWishlist, ClearWishList, DeleteWishlist, GetWishlist } from "../action/wishlist.action";
import { WishlistService } from "../services/wishlist.service";
import { mockResponseData } from "src/app/utilities/helper";
import { FailureResponse } from "../action/response.action";
import { PleaseLoginModalComponent } from "../components/widgets/please-login-modal/please-login-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

export class WishlistStateModel {
  wishlist = {
    data: [] as Product[],
    total: 0
  }
}

@State<WishlistStateModel>({
  name: "wishlist",
  defaults: {
    wishlist: {
      data: [],
      total: 0
    }
  },
})

@Injectable()
export class WishlistState {

  constructor(public router: Router,
    private wishlistService: WishlistService, private modalService: NgbModal, private store: Store) { }

  @Selector()
  static wishlistItems(state: WishlistStateModel) {
    return state.wishlist;
  }

  @Action(GetWishlist)
  getWishlistItems(ctx: StateContext<GetWishlist>) {
    this.wishlistService.skeletonLoader = true;
    return this.wishlistService.getWishlistItems().pipe(
      tap({
        next: result => {
          ctx.patchState({
            wishlist: {
              data: result?.data,
              total: result?.total ? result?.total : result?.data?.length
            }
          });
        },
        complete: () => {
          this.wishlistService.skeletonLoader = false;
        },
        error: err => {
          const messageObject = mockResponseData(err?.error.messageobject);
          console.log(messageObject?.message);
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(AddOrRemoveWishlist)
  add(ctx: StateContext<WishlistStateModel>, action: AddOrRemoveWishlist) {
    // Add Wishlist Logic Here
    return this.wishlistService.addOrRemoveWishlist(action.payload).pipe(
      tap({
        next: result => {
          this.store.dispatch(new GetWishlist());
          // const mockMessageObject = mockResponseData(result.messageobject);
          // this.store.dispatch(new SuccessResponse(mockMessageObject));
          // this.modalService.open(PleaseLoginModalComponent, { centered: true });
        },
        error: err => {
          const messageObject = mockResponseData(err?.error.messageobject);
          this.store.dispatch(new FailureResponse(messageObject));
          this.modalService.open(PleaseLoginModalComponent, { centered: true });
          throw new Error(err?.error?.message);
        }
      })
    );
  };

  @Action(DeleteWishlist)
  delete(ctx: StateContext<WishlistStateModel>, action: DeleteWishlist) {
    return this.wishlistService.addOrRemoveWishlist(action.payload).pipe(
      tap({
        next: result => {
          this.store.dispatch(new GetWishlist());
          // const mockMessageObject = mockResponseData(result.messageobject);
          // this.store.dispatch(new SuccessResponse(mockMessageObject));
          // this.modalService.open(PleaseLoginModalComponent, { centered: true });
        },
        error: err => {
          const messageObject = mockResponseData(err?.error.messageobject);
          this.store.dispatch(new FailureResponse(messageObject));
          this.modalService.open(PleaseLoginModalComponent, { centered: true });
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(ClearWishList)
  clearCart(ctx: StateContext<WishlistStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      wishlist: {
        total: 0,
        data: []
      },
    });
  }

}
