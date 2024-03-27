import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { of, tap } from "rxjs";
import {
  GetCartItems, AddToCartLocalStorage, AddToCart, UpdateCart, DeleteCart,
  CloseStickyCart, ToggleSidebarCart, ClearCart, ReplaceCart, SubractFromCartLocalStorage, BulkAddCart
} from "../action/cart.action";
import { Cart, CartModel } from "../interface/cart.interface";
import { cartService } from "../services/cart.service";
import { NotificationService } from "../services/notification.service";
import { convertStringToNumber, getObjectDataFromLocalStorage, getStringDataFromLocalStorage, mockResponseData, removeDataFromLocalStorage, storeObjectDataInLocalStorage, storeStringDataInLocalStorage } from "src/app/utilities/helper";
import { FailureResponse, SuccessResponse } from "../action/response.action";
import { PleaseLoginModalComponent } from "../components/widgets/please-login-modal/please-login-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

export interface CartStateModel {
  items: Cart[];
  total: number;
  stickyCartOpen: boolean;
  sidebarCartOpen: boolean;
}

@State<CartStateModel>({
  name: "cart",
  defaults: {
    items: [],
    total: 0,
    stickyCartOpen: false,
    sidebarCartOpen: false
  },
})
@Injectable()
export class CartState {

  constructor(private cartService: cartService,
    private notificationService: NotificationService,
    private store: Store, private modalService: NgbModal) {
  }

  ngxsOnInit(ctx: StateContext<CartStateModel>) {
    ctx.dispatch(new ToggleSidebarCart(false));
    ctx.dispatch(new CloseStickyCart());
  }

  @Selector()
  static cartItems(state: CartStateModel) {
    return state.items;
  }

  @Selector()
  static cartTotal(state: CartStateModel) {
    return state.total;
  }

  @Selector()
  static stickyCart(state: CartStateModel) {
    return state.stickyCartOpen;
  }

  @Selector()
  static sidebarCartOpen(state: CartStateModel) {
    return state.sidebarCartOpen;
  }

  @Selector()
  static getCartModel(state: CartModel): CartModel {
    return state;
  }

  @Action(GetCartItems)
  getCartItems(ctx: StateContext<CartStateModel>) {
    const user_id = getStringDataFromLocalStorage("user_id");

    if (user_id) {
      return this.cartService.getCartItems().pipe(
        tap({
          next: result => {
            // Set Selected Varaint
            ctx.patchState({
              items: (result?.data?.items && result?.data?.items.length > 0) ? result?.data?.items : [],
              total: result?.data?.total ? result?.data?.total : 0,
            });
          },
          error: err => {
            const messageObject = mockResponseData(err?.error.messageobject);
            console.log(messageObject?.message);
            throw new Error(err?.error?.message);
          }
        })
      );
    } else {
      const localCartData = getObjectDataFromLocalStorage("cart_data");

      return ctx.patchState({
        items: localCartData?.cartItems,
        total: localCartData.total,
      });
    }
  }

  @Action(AddToCart)
  add(ctx: StateContext<CartStateModel>, action: AddToCart) {

    return this.cartService.addToCart(action.payload).pipe(
      tap({
        next: (result: any) => {
          this.store.dispatch(new GetCartItems());
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

  @Action(AddToCartLocalStorage)
  addToLocalStorage(ctx: StateContext<CartStateModel>, action: AddToCartLocalStorage) {
    let cartData: any = {
      cartItems: [],
      total: 0
    };

    const localCartData = getObjectDataFromLocalStorage("cart_data");

    cartData.cartItems = localCartData ? localCartData.cartItems : [];
    // cartData.total = localCartData ? localCartData.total : 0;
    let mockProduct = {
      product_variation_id: action?.payload?.variations?.id,
      qty: action?.payload?.qty,
      product_id: action?.payload?.product_id ? action?.payload?.product_id : action?.payload?.id,
      product: action?.payload,
      shop: null,
    };

    mockProduct.product.min_price = action.payload.sale_price;

    const indexOf = cartData?.cartItems.findIndex((e: any) => e?.product_id === mockProduct?.product_id);

    if (indexOf <= -1) {
      cartData?.cartItems.push(mockProduct);
    } else {
      cartData.cartItems[indexOf].qty = action?.payload?.qty;
    }

    cartData?.cartItems.map((cart: any) => {
      const productTotal = convertStringToNumber(cart.qty) * convertStringToNumber(cart?.product?.min_price);
      cartData.total += productTotal;
      return cart;
    });

    storeObjectDataInLocalStorage("cart_data", cartData);

    return ctx.patchState({
      items: cartData?.cartItems,
      total: cartData.total,
    });
  }

  @Action(SubractFromCartLocalStorage)
  subractCartLocal(ctx: StateContext<CartStateModel>, action: SubractFromCartLocalStorage) {
    let cartData: any = {
      cartItems: [],
      total: 0
    };

    const localCartData = getObjectDataFromLocalStorage("cart_data");

    cartData.cartItems = localCartData ? localCartData.cartItems : [];
    // cartData.total = localCartData ? localCartData.total : 0;

    const product_id = action?.payload?.product_id ? action?.payload?.product_id : action?.payload.id;

    const indexOf = cartData?.cartItems.findIndex((e: any) => e?.product_id === product_id);

    if (action?.payload?.qty || (action?.payload?.qty != 0)) {
      cartData.cartItems[indexOf].qty = action?.payload?.qty;
    } else {
      cartData.cartItems.splice(indexOf, 1);
    }

    if (cartData?.cartItems.length > 0) {
      cartData?.cartItems.map((cart: any) => {
        const productTotal = convertStringToNumber(cart.qty) * convertStringToNumber(cart?.product?.min_price);
        cartData.total += productTotal;
        return cart;
      });
    }

    storeObjectDataInLocalStorage("cart_data", cartData);

    return ctx.patchState({
      items: cartData?.cartItems,
      total: (cartData?.cartItems.length > 0) ? cartData.total : 0,
    });
  }

  @Action(UpdateCart)
  update(ctx: StateContext<CartStateModel>, action: UpdateCart) {

    // const state = ctx.getState();
    // const cart = [...state.items];
    // const index = cart.findIndex(item => Number(item.id) === Number(action.payload.id));

    // if (cart[index]?.variation && action.payload.variation_id &&
    //   Number(cart[index].id) === Number(action.payload.id) &&
    //   Number(cart[index]?.variation_id) != Number(action.payload.variation_id)) {
    //   return this.store.dispatch(new ReplaceCart(action.payload));
    // }

    // const productQty = cart[index]?.variation ? cart[index]?.variation?.quantity : cart[index]?.product?.quantity;

    // if (productQty < cart[index]?.quantity + action?.payload.quantity) {
    //   this.notificationService.showError(`You can not add more items than available. In stock ${productQty} items.`);
    //   return false;
    // }

    // if (cart[index]?.variation) {
    //   cart[index].variation.selected_variation = cart[index]?.variation?.attribute_values?.map(values => values.value).join('/');
    // }
    // cart[index].quantity = cart[index]?.quantity + action?.payload.quantity;
    // cart[index].sub_total = cart[index]?.quantity * (cart[index]?.variation ? cart[index]?.variation?.sale_price : cart[index].product.sale_price);

    // if (cart[index].quantity < 1) {
    //   this.store.dispatch(new DeleteCart(action.payload.id!));
    //   return of();
    // }

    // let total = state.items.reduce((prev, curr: Cart) => {
    //   return (prev + Number(curr.sub_total));
    // }, 0);

    // ctx.patchState({
    //   ...state,
    //   total: total
    // });

    // return true;
  }

  @Action(ReplaceCart)
  replace(ctx: StateContext<CartStateModel>, action: ReplaceCart) {

    // const state = ctx.getState();
    // const cart = [...state.items];
    // const index = cart.findIndex(item => Number(item.id) === Number(action.payload.id));

    // // Update Cart If cart id same but variant id is different
    // if (cart[index]?.variation && action.payload.variation_id &&
    //   Number(cart[index].id) === Number(action.payload.id) &&
    //   Number(cart[index]?.variation_id) != Number(action.payload.variation_id)) {
    //   cart[index].variation = action.payload.variation!;
    //   cart[index].variation_id = action.payload.variation_id;
    //   cart[index].variation.selected_variation = cart[index]?.variation?.attribute_values?.map(values => values.value).join('/')
    // }

    // cart[index].quantity = 0;

    // const productQty = cart[index]?.variation ? cart[index]?.variation?.quantity : cart[index]?.product?.quantity;

    // if (productQty < cart[index]?.quantity + action?.payload.quantity) {
    //   this.notificationService.showError(`You can not add more items than available. In stock ${productQty} items.`);
    //   return false;
    // }

    // cart[index].quantity = cart[index]?.quantity + action?.payload.quantity;
    // cart[index].sub_total = cart[index]?.quantity * (cart[index]?.variation ? cart[index]?.variation?.sale_price : cart[index].product.sale_price);

    // if (cart[index].quantity < 1) {
    //   this.store.dispatch(new DeleteCart(action.payload.id!));
    //   return of();
    // }

    // let total = state.items.reduce((prev, curr: Cart) => {
    //   return (prev + Number(curr.sub_total));
    // }, 0);

    // ctx.patchState({
    //   ...state,
    //   total: total
    // });

    // return true;
  }

  @Action(DeleteCart)
  delete(ctx: StateContext<CartStateModel>, action: DeleteCart) {
    return this.cartService.removeFromCart(action.payload).pipe(
      tap({
        next: result => {
          this.store.dispatch(new GetCartItems());
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

  @Action(CloseStickyCart)
  closeStickyCart(ctx: StateContext<CartStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      stickyCartOpen: false,
    });
  }

  @Action(ToggleSidebarCart)
  toggleSidebarCart(ctx: StateContext<CartStateModel>, { value }: ToggleSidebarCart) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      sidebarCartOpen: value,
    });
  }

  @Action(ClearCart)
  clearCart(ctx: StateContext<CartStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      items: [],
      total: 0
    });
  }

  @Action(BulkAddCart)
  bulkCart(ctx: StateContext<CartStateModel>, action: BulkAddCart) {
    const user_id = getStringDataFromLocalStorage('user_id');

    const mockRequest: any = [];
    action?.payload.forEach((data: any) => {
      const requestObject = {
        product_variation_id: data?.product_variation_id,
        qty: data?.qty,
        product_id: data?.product_id,
        product: data?.product,
        user_id: user_id,
        shop: null,
      };
      mockRequest.push(requestObject);
    });

    return this.cartService.bulkAddCart({ data: mockRequest }).pipe(
      tap({
        next: (result: any) => {
          this.store.dispatch(new GetCartItems());
          removeDataFromLocalStorage('cart_data');
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

}
