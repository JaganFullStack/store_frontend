import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, Subscribable, of } from 'rxjs';
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
  selectedOrder: any = {};
  products: any;
  test: any[] = [];
  data$: Observable<any[]>;
  @Select(OrderState.selectedOrder) selectedOrder$: Observable<any>;

  constructor(private store: Store, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    this.selectedOrder$.subscribe((data: any) => {
    });

  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {

        if (!params['id']) return of(null);
        return this.store.dispatch(new ViewOrder(params['id']));
      }),
      switchMap(() => this.store.select(OrderState.selectedOrder)),
      filter(order => !!order)
    )
      // .subscribe(order => {
      //   this.order = order;
      //   this.products = this.order.products;
      // });


      .subscribe(order => {
        this.order = order;
        this.data$ = this.order.productslist
        this.test = this.order.productslist
        // this.selectedOrder$ = this.order.productslist;
        console.log(this.data$)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
