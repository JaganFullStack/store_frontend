import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { of, tap } from "rxjs";
import {
  GetCartItems, AddToCartLocalStorage, AddToCart, UpdateCart, DeleteCart,
  CloseStickyCart, ToggleSidebarCart, ClearCart, ReplaceCart
} from "../action/cart.action";
import { Cart, CartModel } from "../interface/cart.interface";
import { cartService } from "../services/cart.service";
import { NotificationService } from "../services/notification.service";
import { getStringDataFromLocalStorage, mockResponseData } from "src/app/utilities/helper";

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
    private store: Store) {
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
    console.log(state);
    return state;
  }

  @Action(GetCartItems)
  getCartItems(ctx: StateContext<CartStateModel>) {
    return this.cartService.getCartItems().pipe(
      tap({
        next: result => {
          // Set Selected Varaint
          ctx.patchState({
            items: result.data?.items?result.data?.items:[],
            total: result.data?.total ? result.data.total : 0,
          });
        },
        error: err => {
          const messageObject = mockResponseData(err.messageobject);
          alert(messageObject?.message);
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(AddToCart)
  add(ctx: StateContext<CartStateModel>, action: AddToCart) {

    return this.cartService.addToCart(action.payload).pipe(
      tap({
        next: (result: any) => {
          this.store.dispatch(new GetCartItems());
          const mockMessageObject = mockResponseData(result?.messageobject);
          alert(mockMessageObject?.message);
        },
        error: err => {
          const messageObject = mockResponseData(err.messageobject);
          alert(messageObject?.message);
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(AddToCartLocalStorage)
  addToLocalStorage(ctx: StateContext<CartStateModel>, action: AddToCartLocalStorage) {

    // let salePrice = action.payload.variation ? action.payload.variation.sale_price : action.payload.product?.sale_price;
    // let result: CartModel = {
    //   items: [{
    //     id: Number(Math.floor(Math.random() * 10000).toString().padStart(4, '0')), // Generate Random Id
    //     quantity: action.payload.quantity,
    //     sub_total: salePrice ? salePrice * action.payload.quantity : 0,
    //     product: action.payload.product!,
    //     product_id: action.payload.product_id,
    //     variation: action.payload.variation!,
    //     variation_id: action.payload.variation_id
    //   }]
    // }

    // const state = ctx.getState();
    // const cart = [...state.items];
    // const index = cart.findIndex(item => item.id === result.items[0].id);

    // let output = { ...state };

    // if (index == -1) {
    //   output.items = [...state.items, ...result.items];
    // }

    // // Set Selected Varaint
    // output.items.filter(item => {
    //   if (item?.variation) {
    //     item.variation.selected_variation = item?.variation?.attribute_values?.map(values => values.value).join('/');
    //   }
    // });

    // // Calculate Total
    // output.total = output.items.reduce((prev, curr: Cart) => {
    //   return (prev + Number(curr.sub_total));
    // }, 0);

    // output.stickyCartOpen = true;
    // output.sidebarCartOpen = true;
    // ctx.patchState(output);

    // setTimeout(() => {
    //   this.store.dispatch(new CloseStickyCart());
    // }, 1500);
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
          const mockMessageObject = mockResponseData(result.messageobject);
          // alert(mockMessageObject?.message);
        },
        error: err => {
          const messageObject = mockResponseData(err.messageobject);
          alert(messageObject?.message);
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

}
