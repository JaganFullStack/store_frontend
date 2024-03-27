import { Component, Input, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { NgbModal, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ProductDetailModalComponent } from '../../../widgets/modal/product-detail-modal/product-detail-modal.component';
import { Product } from '../../../../../shared/interface/product.interface';
import { CartAddOrUpdate, Cart } from '../../../../../shared/interface/cart.interface';
import { AddOrRemoveWishlist, DeleteWishlist } from '../../../../../shared/action/wishlist.action';
import { AddToCompare } from '../../../../../shared/action/compare.action';
import { AddToCart, AddToCartLocalStorage, DeleteCart, GetCartItems, SubractFromCartLocalStorage } from '../../../../../shared/action/cart.action';
import { CartState } from '../../../../../shared/state/cart.state';
import { VariationModalComponent } from '../../modal/variation-modal/variation-modal.component';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { cartService } from 'src/app/shared/services/cart.service';
import { CartModel } from '../../../../../shared/interface/cart.interface';
import { convertStringToNumber, getStringDataFromLocalStorage } from 'src/app/utilities/helper';
import { WishlistState } from 'src/app/shared/state/wishlist.state';
import { PleaseLoginModalComponent } from '../../please-login-modal/please-login-modal.component';


@Component({
  selector: 'app-product-box-horizontal',
  templateUrl: './product-box-horizontal.component.html',
  styleUrls: ['./product-box-horizontal.component.scss']
})
export class ProductBoxHorizontalComponent {
  cartItems: Array<any> = [];
  @Input() product: any;
  @Input() class: string;
  @Input() close: boolean;
  apibaseurl: string = environment.apiBaseUrl;
  ApiImageurl = environment.backendBaseImageUrl;

  @Select(CartState.cartItems) cartItem$: Observable<Cart[]>;
  @Select(WishlistState.wishlistItems) wishlistItem$: Observable<any>;
  @Select(CartState.getCartModel) cartModel$: Observable<CartModel[]>;

  @ViewChild("productDetailModal") productDetailModal: ProductDetailModalComponent;
  @ViewChild("variationModal") VariationModal: VariationModalComponent;

  public cartItem: Cart | null;
  public cartModel: CartModel | null;

  public currentDate: number | null;
  public saleStartDate: number | null;
  OMR: number | undefined;

  responseError: null;
  router: any;
  themeOption$: any;
  cartTotal$: any;
  shippingFreeAmt: any;
  cartStyle: any;
  setting$: any;
  cartTotal: any;
  shippingCal: number;
  confetti: number;


  // constructor(private store: Store,
  //   config: NgbRatingConfig) {
  // 	config.max = 5;
  // 	config.readonly = true;
  // }

  constructor(private store: Store, config: NgbRatingConfig, public cartService: cartService, private modalService: NgbModal) {

    this.cartItem$.subscribe(items => {
      this.cartItems = items;
      this.cartItem = items.find(item => item.product.id == this.product.id)!;
    });

    this.wishlistItem$.subscribe(items => {
      const data = items.data.find((item: any) => item.id == this.product.id)!;
      this.product.isWishlisted = data ? true : false;
    });

    config.max = 5;
    config.readonly = true;

    // this.themeOption$.subscribe((option: { general: { cart_style: any; }; }) => this.cartStyle = option?.general?.cart_style);

    // // Calculation
    // this.cartTotal$.subscribe((total: any) => {

    //   this.setting$.subscribe((setting: { general: { min_order_free_shipping: any; }; }) => this.shippingFreeAmt = setting?.general?.min_order_free_shipping);
    //   this.cartTotal = total;
    //   this.shippingCal = (this.cartTotal$ * 100) / this.shippingFreeAmt;
    //   if(this.shippingCal > 100) {
    //     this.shippingCal = 100;
    //     if(this.confetti == 0) {
    //       this.confetti = 1;
    //       setTimeout(() => {
    //         this.confetti = 2;
    //       }, 4500);
    //     }
    //   } else {
    //     this.confetti = 0;
    //   }
    // });
  }

  ngOnInit() {
  }

  addCart(product: any) {

    const userId = getStringDataFromLocalStorage("user_id");

    let responseObject = {
      "user_id": userId,
      "product_variation_id": product.variations.id,
      "product_id": product.id,
      "qty": 0
    };

    const itemFound = this.cartItems.find((item: any) => item.product_id === product.id);

    if (itemFound) {
      responseObject.qty = convertStringToNumber(itemFound?.qty) + 1;
    } else {
      responseObject.qty = 1;
    }

    if (userId) {
      this.store.dispatch(new AddToCart(responseObject));
    } else {
      product.qty = responseObject.qty;
      this.store.dispatch(new AddToCartLocalStorage(product));
    }
  };

  subractItemCount(product: any) {

    const userId = getStringDataFromLocalStorage("user_id");

    let requestObject = {
      "user_id": userId,
      "product_variation_id": product.variations.id,
      "product_id": product.id,
      "qty": 0
    };
    const itemFound = this.cartItems.find((item: any) => item.product_id === product.id);
    const formattedQty = convertStringToNumber(itemFound.qty);
    if ((formattedQty - 1) === 0) {
      product.qty = 0;
      const object = {
        id: itemFound.id
      };

      if (userId) {
        this.store.dispatch(new DeleteCart(object));
      } else {
        this.store.dispatch(new SubractFromCartLocalStorage(product));
      }
    } else {
      requestObject.qty = formattedQty - 1;

      if (userId) {
        this.store.dispatch(new AddToCart(requestObject));
      } else {
        product.qty = requestObject.qty;
        this.store.dispatch(new SubractFromCartLocalStorage(product));
      }
    }
  };

  removeCart(product: any) {

    const responseObject = {
      "user_id": 5,
      "product_variation_id": 5,
      "product_id": 2,
      "qty": 5
    }
    this.store.dispatch(new AddToCart({ responseObject }));
  }

  addToWishlist(id: number) {
    this.store.dispatch(new AddOrRemoveWishlist({ product_id: id }));
  }

  addOrRemoveWishList(product: any) {
    const userId = getStringDataFromLocalStorage("user_id");

    if (userId) {
      const requestObject = {
        user_id: userId,
        product_id: product.id
      };

      this.store.dispatch(new AddOrRemoveWishlist(requestObject));
    } else {
      const modalRef = this.modalService.open(PleaseLoginModalComponent, { centered: true });
      modalRef.componentInstance.closeModalEvent.subscribe(() => {
        modalRef.close();
      });
    }



  };

  removeWishlist(product: any) {
    const userId = getStringDataFromLocalStorage("user_id");

    const requestObject = {
      user_id: userId,
      product_id: product.id
    };

    this.store.dispatch(new DeleteWishlist(requestObject));
  }

  addToCompar(id: number) {
    this.store.dispatch(new AddToCompare({ product_id: id }));
  }

}
