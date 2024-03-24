import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../../shared/interface/breadcrumb';
import { Cart, CartAddOrUpdate } from '../../../shared/interface/cart.interface';
import { CartState } from '../../../shared/state/cart.state';
import { UpdateCart, DeleteCart, AddToCart } from '../../../shared/action/cart.action';
import { AddOrRemoveWishlist } from '../../../shared/action/wishlist.action';
import { convertStringToNumber, getStringDataFromLocalStorage } from 'src/app/utilities/helper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems: Array<any> = [];
  apiBaseUrl:string=environment.apiBaseUrl;
  @Select(CartState.cartItems) cartItem$: Observable<Cart[]>;
  @Select(CartState.cartTotal) cartTotal$: Observable<number>;

  public breadcrumb: Breadcrumb = {
    title: "Cart",
    items: [{ label: 'Cart', active: true }]
  }

  constructor(private store: Store) {
    this.cartItem$.subscribe(items => {
      this.cartItems = items;
      console.log(this.cartItems)

      // this.cartItem = items.find(item => item.product.id == this.product.id)!;
    });
    this.cartTotal$.subscribe(items => {
      // this.cartItems = items;
      console.log(items)

      // this.cartItem = items.find(item => item.product.id == this.product.id)!;
    });
  }

  updateQuantity(item: Cart, qty: number) {
    const params: CartAddOrUpdate = {
      id: item.id,
      product: item.product,
      product_id: item.product.id,
      variation: item.variation,
      variation_id: item?.variation_id ? item?.variation_id : null,
      quantity: qty,
      GuId: null
    }
    this.store.dispatch(new UpdateCart(params));
  }

  delete(itemId: number) {
    this.store.dispatch(new DeleteCart({ id: itemId }));
  }

  addToWishlist(id: number) {
    this.store.dispatch(new AddOrRemoveWishlist({ product_id: id }));
  }


  addToCart(product: any) {

    const userId = getStringDataFromLocalStorage("user_id");

    let responseObject = {
      "user_id": userId,
      "product_variation_id": product.product_variation_id,
      "product_id": product.product_id,
      "qty": 0
    };

    const itemFound = this.cartItems.find((item: any) => item.product_id === product.product_id);

    if (itemFound) {
      responseObject.qty = convertStringToNumber(itemFound.qty) + 1;
    } else {
      responseObject.qty = 1;
    }

    this.store.dispatch(new AddToCart(responseObject));
  };

  subractFromItemCount(product: any) {

    const userId = getStringDataFromLocalStorage("user_id");

    let requestObject = {
      "user_id": userId,
      "product_variation_id": product.product_variation_id,
      "product_id": product.product_id,
      "qty": 0
    };

    const itemFound = this.cartItems.find((item: any) => item.product_id === product.product_id);
    const formattedQty = convertStringToNumber(itemFound.qty);
    if ((formattedQty-1) === 0) {
      const object = {
        id: itemFound.id
      };

      this.store.dispatch(new DeleteCart(object));
    } else {
      requestObject.qty = formattedQty - 1;

      this.store.dispatch(new AddToCart(requestObject));
    }
  };

  removeCart(product: any) {
    console.log("ts_product", product);
    const responseObject = {
      "user_id": 5,
      "product_variation_id": 5,
      "product_id": 2,
      "qty": 5
    }
    // this.store.dispatch(new AddToCart({ responseObject }));
  }

}
