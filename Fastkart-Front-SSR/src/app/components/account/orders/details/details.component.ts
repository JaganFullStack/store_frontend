import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { ViewOrder } from '../../../../shared/action/order.action';
import { GetOrderStatus } from '../../../../shared/action/order-status.action';
import { OrderState } from '../../../../shared/state/order.state';
import { OrderStatusState } from '../../../../shared/state/order-status.state';
import { Order } from '../../../../shared/interface/order.interface';
import { OrderStatusModel } from '../../../../shared/interface/order-status.interface';
import { RefundModalComponent } from '../../../../shared/components/widgets/modal/refund-modal/refund-modal.component';
import { PayModalComponent } from '../../../../shared/components/widgets/modal/pay-modal/pay-modal.component';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-order-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})


export class OrderDetailsComponent implements OnInit, OnDestroy {
  @ViewChild("refundModal") refundModal: RefundModalComponent;
  apiBaseUrl: string = environment.apiBaseUrl;
  private destroy$ = new Subject<void>();
  order: any;
  order_data: any;
  products: Array<any> = [];
  selectedOrder: any = null;
  selectedProducts: Array<any> = [];
  @Select(OrderState.selectedOrder) selectedOrder$: Observable<any>;

  constructor(private store: Store, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    this.selectedOrder$.subscribe((data: any) => {
      this.selectedOrder = data;
      this.order_data = data;
      this.selectedProducts = data?.products;
      console.log(this.selectedProducts[0].name)
      console.log(this.order_data)
    });

  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {

        if (!params['id']) return of(null);
        return this.store.dispatch(new ViewOrder(params['id']));
      })
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
