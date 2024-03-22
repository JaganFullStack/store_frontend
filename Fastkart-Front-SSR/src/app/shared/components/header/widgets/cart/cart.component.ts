import { Component, Input, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Cart, CartAddOrUpdate } from '../../../../interface/cart.interface';
import { CartState } from '../../../../state/cart.state';
import { DeleteCart, GetCartItems, ToggleSidebarCart, UpdateCart } from '../../../../action/cart.action';
import { ThemeOptionState } from '../../../../state/theme-option.state';
import { Option } from '../../../../interface/theme-option.interface';
import { SettingState } from '../../../../state/setting.state';
import { Values } from '../../../../interface/setting.interface';
import { VariationModalComponent } from '../../../widgets/modal/variation-modal/variation-modal.component';
import { cartService } from '../../../../services/cart.service';
import { response } from 'express';
import { Product } from 'src/app/shared/interface/product.interface';

@Component({
  selector: 'app-header-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {

  @Select(CartState.cartItems) cartItem$: Observable<Cart[]>;
  @Select(CartState.cartTotal) cartTotal$: Observable<number>;
  @Select(CartState.sidebarCartOpen) sidebarCartOpen$: Observable<boolean>;
  @Select(ThemeOptionState.themeOptions) themeOption$: Observable<Option>;
  @Select(SettingState.setting) setting$: Observable<Values>;

  @ViewChild("variationModal") VariationModal: VariationModalComponent;

  @Input() style: string = 'basic';

  public cartStyle: string = 'cart_sidebar';
  public shippingFreeAmt: number = 0;
  public cartTotal: number = 0;
  public shippingCal: number = 0;
  public confettiItems = Array.from({ length: 150 }, (_, index) => index);
  public confetti: number = 0;
  public loader: boolean = false;
  userEmailId: any;
  responseError: null;
  router: any;

  constructor(private store: Store, public cartService: cartService) {
    this.store.dispatch(new GetCartItems());
    this.themeOption$.subscribe(option => this.cartStyle = option?.general?.cart_style);

    // Calculation
    this.cartTotal$.subscribe(total => {
      this.setting$.subscribe(setting => this.shippingFreeAmt = setting?.general?.min_order_free_shipping);
      this.cartTotal = total;
      this.shippingCal = (this.cartTotal * 100) / this.shippingFreeAmt;
      if(this.shippingCal > 100) {
        this.shippingCal = 100;
        if(this.confetti == 0) {
          this.confetti = 1;
          setTimeout(() => {
            this.confetti = 2;
          }, 4500);
        }
      } else {
        this.confetti = 0;
      }
    });
  }

  cartToggle(value: boolean) {
    this.store.dispatch(new ToggleSidebarCart(value));
  }

  updateQuantity(item: Cart, qty: number) {
    let userEmailId = localStorage.getItem('UserEmail');
    let GuId = localStorage.getItem('GuId');


    const params: CartAddOrUpdate = {
      id: item?.id,
      product_id: item?.product?.id,
      product: item?.product ? item?.product : null,
      variation_id: item?.variation_id ? item?.variation_id : null,
      variation: item?.variation ? item?.variation : null,
      quantity: qty,
      GuId:null
    }
          // LOGIN NEW CODE 
          if (userEmailId) {
            try {
              const params: CartAddOrUpdate = {
                id: item?.id,
                product_id: item?.product?.id,
                product: item?.product ? item?.product : null,
                variation_id: item?.variation_id ? item?.variation_id : null,
                variation: item?.variation ? item?.variation : null,
                quantity: qty,
                GuId: null
              }

              console.log(params)
              this.cartService.addToCart(params).subscribe({
                next: (response: any) => {  
                  this.responseError=null;
                    
                    console.log(response);

                    localStorage.setItem('AuthToken', response?.token);
                    localStorage.setItem('UserEmail',response?.Email)


                    const redirectUrl =  '/account/dashboard';
                    this.router.navigateByUrl(redirectUrl);
                    // window.location.reload();
                   
                },
                error: (error) => {
                  this.responseError=  error?.error?.messages?.error ?? 'INVAILD EMAILID OR PASSWORD';
                  console.log("Api Error",error.error.messages.error);
                },  
              });
          } catch (Error: any) {
            console.log("catch Error",Error);
          }
        } else {
          // Form is invalid, display errors if needed
          console.log('Invalid form submission');
        }
          // END OF LOGIN CODE 
          // Navigate to the intended URL after successful login
          // AuthLogin
          // const redirectUrl = this.authService.redirectUrl || '/account/dashboard';
        
          // this.router.navigateByUrl(redirectUrl);

          // Clear the stored redirect URL
          // this.authService.redirectUrl = undefined; 
  }



  // updateQuantity(item: Cart, qty: number) {
  //   const params: CartAddOrUpdate = {
  //     id: item?.id,
  //     product_id: item?.product?.id,
  //     product: item?.product ? item?.product : null,
  //     variation_id: item?.variation_id ? item?.variation_id : null,
  //     variation: item?.variation ? item?.variation : null,
  //     quantity: qty
  //   }
  //   this.store.dispatch(new UpdateCart(params));
  // }

  delete(id: number) {
    this.store.dispatch(new DeleteCart(id));
  }

}
