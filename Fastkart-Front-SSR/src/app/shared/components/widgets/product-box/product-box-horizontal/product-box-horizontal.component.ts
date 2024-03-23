import { Component, Input, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ProductDetailModalComponent } from '../../../widgets/modal/product-detail-modal/product-detail-modal.component';
import { Product } from '../../../../../shared/interface/product.interface';
import { CartAddOrUpdate, Cart } from '../../../../../shared/interface/cart.interface';
import { AddToWishlist, DeleteWishlist } from '../../../../../shared/action/wishlist.action';
import { AddToCompare } from '../../../../../shared/action/compare.action';
import { AddToCart, GetCartItems } from '../../../../../shared/action/cart.action';
import { CartState } from '../../../../../shared/state/cart.state';
import { VariationModalComponent } from '../../modal/variation-modal/variation-modal.component';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { cartService } from 'src/app/shared/services/cart.service';
import { CartModel } from '../../../../../shared/interface/cart.interface';


@Component({
  selector: 'app-product-box-horizontal',
  templateUrl: './product-box-horizontal.component.html',
  styleUrls: ['./product-box-horizontal.component.scss']
})
export class ProductBoxHorizontalComponent {

  @Input() product: Product;
  @Input() class: string;
  @Input() close: boolean;

  ApiImageurl = environment.backendBaseImageUrl;

  @Select(CartState.cartItems) cartItem$: Observable<Cart[]>;
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

  constructor(private store: Store, config: NgbRatingConfig, public cartService: cartService) {

    config.max = 12;
    config.readonly = true;
    this.cartItem$.subscribe((items: any) => {
      // this.cartItem = items.find(item => item.product.id == this.product.id)!;
      this.cartItem = items;
    });
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
    this.store.dispatch(new GetCartItems());
  }





  // addToCart(product: Product, qty: number) {


  //   const params: CartAddOrUpdate = {
  //     id: this.cartItem ? this.cartItem.id : null,
  //     product: product,
  //     product_id: product?.id,
  //     variation_id: this.cartItem ? this.cartItem?.variation_id : null,
  //     variation: this.cartItem ? this.cartItem?.variation : null,
  //     quantity: qty,
  //     GuId: null
  //   }
  //   this.store.dispatch(new AddToCart(params));
  // }


  addToCart(product: Product, qty: number) {
    let userEmailId = localStorage.getItem('UserEmail');
    let GuId = localStorage.getItem('GuestId'); const generatedUuid = uuidv4();
    console.log('Generated UUID:', generatedUuid);
    console.log('Product Id:', product?.id); if (userEmailId) {
      // const params: CartAddOrUpdate = {
      //   // id: this.cartItem ? this.cartItem.id : null,
      //   product: product,
      //   product_id: product?.id,
      //   // variation_id: this.cartItem ? this.cartItem?.variation_id : null,
      //   // variation: this.cartItem ? this.cartItem?.variation : null,
      //   quantity: qty,
      //   GuId: null
      // }
    }
    // const params: CartAddOrUpdate = {
    //   // id: this.cartItem ? this.cartItem.id : null,
    //   // product: product,
    //   // product_id: product?.id,
    //   // variation_id: this.cartItem ? this.cartItem?.variation_id : null,
    //   // variation: this.cartItem ? this.cartItem?.variation : null,
    //   // quantity: qty,
    //   // GuId: GuId ? GuId : generatedUuid
    // }
    // console.log(params)
    // this.cartService.addToCart(params).subscribe({
    //   next: (response: any) => {
    //     this.responseError = null;

    //     console.log(response);
    //     localStorage.setItem('GuestId', response?.GuestId);
    //     const redirectUrl = '/account/dashboard';
    //     this.router.navigateByUrl(redirectUrl);
    //     // window.location.reload();       
    //   },
    //   error: (error: any) => {
    //     this.responseError = error?.error?.messages?.error ?? 'INVALID CREDENTIALS';
    //     console.log("Api Error", error.error.messages.error);
    //   },
    // });
    const redirectUrl = '/account/dashboard';

    this.router.navigateByUrl(redirectUrl);
  }


  addToWishlist(id: number) {
    this.store.dispatch(new AddToWishlist({ product_id: id }));
  }

  removeWishlist(id: number) {
    this.store.dispatch(new DeleteWishlist(id));
  }

  addToCompar(id: number) {
    this.store.dispatch(new AddToCompare({ product_id: id }));
  }

}
