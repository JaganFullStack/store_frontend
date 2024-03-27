import { Injectable, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetOrders, ViewOrder, Checkout, PlaceOrder, Clear, VerifyPayment, RePayment, TrackOrder } from "../action/order.action";
import { Order, OrderCheckout, } from "../interface/order.interface";
import { OrderService } from "../services/order.service";
import { ClearCart, GetCartItems } from "../action/cart.action";
import { PleaseLoginModalComponent } from "../components/widgets/please-login-modal/please-login-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { mockResponseData } from "src/app/utilities/helper";
import { FailureResponse, SuccessResponse } from "../action/response.action";

export class OrderStateModel {

  order = {
    data: [] as Order[],
    total: 0
  }
  selectedOrder: Order | null;
  checkout: OrderCheckout | null
  // trackingorderlist: Trackinglist | null

}


@State<OrderStateModel>({
  name: "order",
  defaults: {
    order: {
      data: [],
      total: 0
    },
    selectedOrder: null,
    checkout: null,

    // trackingorderlist: null,
  },
})
@Injectable()
export class OrderState {
  @ViewChild("Place Order") PopupModal: PleaseLoginModalComponent;

  constructor(private store: Store,
    private router: Router,
    private orderService: OrderService, private modalService: NgbModal) { }

  @Selector()
  static order(state: OrderStateModel) {
    return state.order;
  }

  @Selector()
  static selectedOrder(state: OrderStateModel) {
    return state.selectedOrder;
  }

  // @Selector()
  // static trackedOrder(state: OrderStateModel) {
  //   return state.trackingorderlist;
  // }



  @Selector()
  static checkout(state: OrderStateModel) {
    return state.checkout;
  }

  @Action(GetOrders)
  getOrders(ctx: StateContext<OrderStateModel>, action: GetOrders) {
    return this.orderService.getOrders(action?.payload).pipe(
      tap({
        next: result => {

          console.log("result of get orders ", result);
          ctx.patchState({
            order: {
              data: result.data,
              total: result?.total ? result?.total : result.data?.length
            }
          });
        },
        error: err => {
          const messageObject = mockResponseData(err?.error.messageobject);
          console.log(messageObject?.message);
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(ViewOrder)
  viewOrder(ctx: StateContext<OrderStateModel>, { id }: ViewOrder) {
    this.orderService.skeletonLoader = true;
    return this.orderService.getvieewwwOrders(id).pipe(
      tap({
        next: result => {
          // console.log(result, "viewww vorderrrrr");
          const state = ctx.getState();
          const order = result.data;
          // console.log(order, "order which I have selected");
          ctx.patchState({
            ...state,
            selectedOrder: order
          });
        },
        error: err => {
          const messageObject = mockResponseData(err?.error.messageobject);
          this.store.dispatch(new FailureResponse(messageObject));
          this.modalService.open(PleaseLoginModalComponent, { centered: true });
          throw new Error(err?.error?.message);
        },
        complete: () => {
          this.orderService.skeletonLoader = false;
        }
      })
    );
  }



  //   viewOrder(ctx: StateContext<OrderStateModel>, { id }: ViewOrder) {

  //     this.orderService.skeletonLoader = true;
  //     return this.orderService.getOrders().pipe(
  //       tap({
  //         next: result => {
  //           console.log(result,"viewww vorderrrrr")
  //           const state = ctx.getState();
  //           const order = result.data.find((order: any) => order.id == id);
  // console.log(order,"oder whiuch i hav selected")
  //           ctx.patchState({
  //             ...state,
  //             selectedOrder: order
  //           });
  //         },
  //         error: err => {
  //           throw new Error(err?.error?.message);
  //         },
  //         complete: () => {
  //           this.orderService.skeletonLoader = false;
  //         }
  //       })
  //     );


  //   }



  // @Action(TrackOrder)


  // TrackOrder(ctx: StateContext<OrderStateModel>, { order_code }: TrackOrder) {
  //   this.orderService.skeletonLoader = true;
  //   return this.orderService.getTrackOrdersList(order_code).pipe(
  //     tap({
  //       next: result => {

  //         const state = ctx.getState();
  //         const order = result.data;

  //         ctx.patchState({
  //           ...state,
  //           trackingorderlist: order
  //         });
  //       },
  //       error: err => {
  //         throw new Error(err?.error?.message);
  //       },
  //       complete: () => {
  //         this.orderService.skeletonLoader = false;
  //       }
  //     })
  //   );
  // }


  @Action(Checkout)
  checkout(ctx: StateContext<OrderStateModel>, action: Checkout) {

    const state = ctx.getState();

    // It Just Static Values as per cart default value (When you are using api then you need calculate as per your requirement)
    const order = {
      total: {
        convert_point_amount: -10,
        convert_wallet_balance: -84.4,
        coupon_total_discount: 10,
        points: 300,
        points_amount: 10,
        shipping_total: 0,
        sub_total: 35.19,
        tax_total: 2.54,
        total: 37.73,
        wallet_balance: 84.4,
      }
    }

    ctx.patchState({
      ...state,
      checkout: order
    });

  }

  @Action(PlaceOrder)
  placeOrder(ctx: StateContext<OrderStateModel>, action: any) {

    return this.orderService.placeOrder(action.payload).pipe(
      tap({
        next: result => {
          this.store.dispatch(new GetOrders());
          this.store.dispatch(new GetCartItems());
          this.router.navigate(['/home']);
          const mockMessageObject = mockResponseData(result.messageobject);
          this.store.dispatch(new SuccessResponse(mockMessageObject));
          this.modalService.open(PleaseLoginModalComponent, { centered: true });
        },
        error: err => {
          const messageObject = mockResponseData(err?.error.messageobject);
          this.store.dispatch(new FailureResponse(messageObject));
          this.modalService.open(PleaseLoginModalComponent, { centered: true });
          throw new Error(err?.error?.message);
        },
        complete: () => {
          this.orderService.skeletonLoader = false;
        }
      })
    );
  }

  @Action(RePayment)
  verifyPayment(ctx: StateContext<OrderStateModel>, action: RePayment) {
    // Verify Payment Logic Here
  }

  @Action(VerifyPayment)
  rePayment(ctx: StateContext<OrderStateModel>, action: VerifyPayment) {
    // Re Payment Logic Here
  }

  @Action(Clear)
  clear(ctx: StateContext<OrderStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      checkout: null
    });
  }

}
