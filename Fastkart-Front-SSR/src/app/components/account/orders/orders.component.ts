import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OrderState } from '../../../shared/state/order.state';
import { GetOrders } from '../../../shared/action/order.action';
import { OrderModel } from '../../../shared/interface/order.interface';
import { Params } from '../../../shared/interface/core.interface';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
  defaultOrderStatus = "COD";

  @Select(OrderState.order) order$: Observable<any>;

  public filter: Params = {
    'page': 1, // Current page number
    'paginate': 10, // Display per page,
  };

  constructor(private store: Store) {
    this.store.dispatch(new GetOrders(this.filter));
  }

  setPaginate(page: number) {
    this.filter['page'] = page;
    this.store.dispatch(new GetOrders(this.filter));
  }
  // id:any
  //   click(id:any){


  //     alert(id)
  //   }

}
