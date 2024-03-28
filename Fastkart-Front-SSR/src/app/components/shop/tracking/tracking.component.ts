import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, filter, of, switchMap, takeUntil } from 'rxjs';
import { Breadcrumb } from '../../../shared/interface/breadcrumb';
import { AccountUser } from "../../../shared/interface/account.interface";
import { AccountState } from '../../../shared/state/account.state';
import { OrderState } from '../../../shared/state/order.state';
import {  Clear, GetOrders, ViewOrder } from '../../../shared/action/order.action';
import { SettingState } from '../../../shared/state/setting.state';
import { Values,  } from '../../../shared/interface/setting.interface';
import { environment } from 'src/environments/environment';
import { Params } from '@angular/router';

@Component({
  selector: 'app-tracking',
  // standalone: true,
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss',
  // imports: [SharedModule]
})

export class TrackingComponent {
  route: any;
  order: any;
  orderJson: string;
  products: any[];
  public term = new FormControl();
  apiBaseurl: string = environment.apiBaseUrl;
  defaultOrderStatus = "COD";

  public breadcrumb: Breadcrumb = {
    title: "Tracking",
    items: [{ label: 'Tracking', active: true }],
  }
  @Select(OrderState.order) order$: Observable<any>;

  @Select(AccountState.user) user$: Observable<AccountUser>;

  @Select(SettingState.setting) setting$: Observable<Values>;


  @ViewChild('cpn', { static: false }) cpnRef: ElementRef<HTMLInputElement>;

  public loading: boolean = false;
  public filter: Params = {
    'page': 1, // Current page number
    'paginate': 10, // Display per page,
  };


  constructor(private store: Store,
    private formBuilder: FormBuilder) {
   
      this.store.dispatch(new GetOrders(this.filter)).subscribe(() => {
        console.log(this.filter)
      });
  }
  setPaginate(page: number) {
    this.filter['page'] = page;
    this.store.dispatch(new GetOrders(this.filter));
  }

  // mahi searchhhhhhhhhhhhhhhh
  searchOrder() {
    const orderId = this.term.value;
    if (orderId) {
      this.store.dispatch(new ViewOrder(orderId)).subscribe(() => {
        this.store.select(OrderState.selectedOrder).subscribe(data => {
          if (data) {
            this.order = data;
          }
        });
      });
    }
  }
  
  ngOnDestroy() {
    this.store.dispatch(new Clear());
  }
}
