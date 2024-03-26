import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, filter, of, switchMap, takeUntil } from 'rxjs';
import { Breadcrumb } from '../../../shared/interface/breadcrumb';
import { AccountUser } from "../../../shared/interface/account.interface";
import { AccountState } from '../../../shared/state/account.state';
import { CartState } from '../../../shared/state/cart.state';
import { GetCartItems } from '../../../shared/action/cart.action';
import { OrderState } from '../../../shared/state/order.state';
import { Checkout, PlaceOrder, Clear, ViewOrder } from '../../../shared/action/order.action';
import { AddressModalComponent } from '../../../shared/components/widgets/modal/address-modal/address-modal.component';
import { Cart } from '../../../shared/interface/cart.interface';
import { SettingState } from '../../../shared/state/setting.state';
import { GetSettingOption } from '../../../shared/action/setting.action';
import { OrderCheckout } from '../../../shared/interface/order.interface';
import { Values, DeliveryBlock } from '../../../shared/interface/setting.interface';
import { environment } from 'src/environments/environment';
import { getStringDataFromLocalStorage } from 'src/app/utilities/helper';
import { SharedModule } from "../../../shared/shared.module";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tracking',
    standalone: true,
    templateUrl: './tracking.component.html',
    styleUrl: './tracking.component.scss',
    imports: [SharedModule]
})
// export class TrackingComponent {

// }


export class TrackingComponent {

  public term = new FormControl();
  apiBaseurl: string = environment.apiBaseUrl;
  shippingAddressList: Array<any> = [];
  billingAddressList: Array<any> = [];


  public breadcrumb: Breadcrumb = {
    title: "Tracking",
    items: [{ label: 'Tracking', active: true }],
    
  }

  @Select(AccountState.user) user$: Observable<AccountUser>;
  @Select(CartState.cartItems) cartItem$: Observable<any[]>;
  @Select(CartState.cartTotal) cartTotal$: Observable<any>;
  @Select(OrderState.checkout) checkout$: Observable<OrderCheckout>;
  @Select(SettingState.setting) setting$: Observable<Values>;

  @ViewChild("addressModal") AddressModal: AddressModalComponent;
  @ViewChild('cpn', { static: false }) cpnRef: ElementRef<HTMLInputElement>;

  public form: FormGroup;
  public coupon: boolean = true;
  public couponCode: string;
  public appliedCoupon: boolean = false;
  public couponError: string | null;
  public checkoutTotal: OrderCheckout;
  public loading: boolean = false;
  route: any;

  constructor(private store: Store,
    private formBuilder: FormBuilder) {
    this.store.dispatch(new GetCartItems());
    this.store.dispatch(new GetSettingOption());

    this.user$.subscribe((data: any) => {
      this.shippingAddressList = data?.address.filter((address: any) => address.type === "Shipping");
      this.billingAddressList = data?.address.filter((address: any) => address.type === "Billing");
    });

    this.form = this.formBuilder.group({
      products: this.formBuilder.array([], [Validators.required]),
      shipping_address_id: new FormControl('', [Validators.required]),
      billing_address_id: new FormControl('', [Validators.required]),
      points_amount: new FormControl(false),
      wallet_balance: new FormControl(false),
      coupon: new FormControl(),
      delivery_description: new FormControl('', [Validators.required]),
      delivery_interval: new FormControl(),
      payment_method: new FormControl('', [Validators.required])
    });
   
  }

  get productControl(): FormArray {
    return this.form.get("products") as FormArray;
  }
  order: any; 
  orderJson: string;
  products:any[];

  ngOnInit() {
    this.checkout$.subscribe(data => this.checkoutTotal = data);
    this.cartItem$.subscribe(items => {
      if (!items?.length) {
        return;
      }
      this.productControl.clear();
      items!.forEach((item: Cart) =>
        this.productControl.push(
          this.formBuilder.group({
            product_id: new FormControl(item?.product_id, [Validators.required]),
            variation_id: new FormControl(item?.variation_id ? item?.variation_id : ''),
            quantity: new FormControl(item?.qty),
          })
        ));
    });
 

  }




// mahi searchhhhhhhhhhhhhhhh
  searchOrder() {
    const orderId = this.term.value;
    if (orderId) {
      this.store.dispatch(new ViewOrder(orderId)).subscribe(() => {
      
        this.store.select(OrderState.selectedOrder).subscribe(order => {
          console.log(order);

          if (order) {
            this.order = order;
            // this.orderJson = JSON.stringify(this.order);

            console.log(this.order,"searched order")
          }
        });
      });
    }
  }




  selectShippingAddress(id: number) {
    if (id) {
      this.form.controls['shipping_address_id'].setValue(Number(id));
      this.checkout();
    }
  }

  selectBillingAddress(id: number) {
    if (id) {
      this.form.controls['billing_address_id'].setValue(Number(id));
      this.checkout();
    }
  }

  selectDelivery(value: DeliveryBlock) {
    this.form.controls['delivery_description'].setValue(value?.delivery_description);
    this.form.controls['delivery_interval'].setValue(value?.delivery_interval);
    this.checkout();
  }

  selectPaymentMethod(value: string) {
    this.form.controls['payment_method'].setValue(value);
    this.checkout();
  }

  togglePoint(event: Event) {
    this.form.controls['points_amount'].setValue((<HTMLInputElement>event.target)?.checked);
    this.checkout();
  }

  toggleWallet(event: Event) {
    this.form.controls['wallet_balance'].setValue((<HTMLInputElement>event.target)?.checked);
    this.checkout();
  }

  showCoupon() {
    this.coupon = true;
  }

  setCoupon(value?: string) {
    this.couponError = null;

    if (value)
      this.form.controls['coupon'].setValue(value);
    else
      this.form.controls['coupon'].reset();

    this.store.dispatch(new Checkout(this.form.value)).subscribe({
      error: (err) => {
        this.couponError = err.message;
      },
      complete: () => {
        this.appliedCoupon = value ? true : false;
        this.couponError = null;
      }
    });
  }

  couponRemove() {
    this.setCoupon();
  }

  checkout() {

    // If has coupon error while checkout
    if (this.couponError) {
      this.couponError = null;
      this.cpnRef.nativeElement.value = '';
      this.form.controls['coupon'].reset();
    }

    if (this.form.valid) {
      this.loading = true;
      this.store.dispatch(new Checkout(this.form.value)).subscribe({
        error: (err) => {
          this.loading = false;
          throw new Error(err);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  placeorder() {

    const user_id = getStringDataFromLocalStorage("user_id");

    if (this.form.value.shippingAddressList == '' || this.form.value?.shippingAddressList) {
      const defaulShipId = (this.shippingAddressList.length > 0) ? this.shippingAddressList[0].id : '';
      this.form.controls['shipping_address_id'].setValue(defaulShipId);
    }

    if(this.form.value.billing_address_id == '' || this.form.value?.billing_address_id){
      const defaulBillId = (this.shippingAddressList.length > 0) ? this.billingAddressList[0].id : '';
      this.form.controls['billing_address_id'].setValue(defaulBillId);
    }

    const requestObject = {
      user_id: user_id,
      billing_address_id: this.form.value.billing_address_id,
      shipping_address_id: this.form.value.shipping_address_id
    };

    this.store.dispatch(new PlaceOrder(requestObject)).subscribe((data:any)=>{
      console.log("paying",data)
    })
  }

  ngOnDestroy() {
    this.store.dispatch(new Clear());
    this.form.reset();
  }

}


