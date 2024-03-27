import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, OrderModel } from '../interface/order.interface';
import { Params } from '../interface/core.interface';
import { getStringDataFromLocalStorage } from 'src/app/utilities/helper';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public skeletonLoader: boolean = false;

  constructor(private http: HttpClient) { }

  getOrders(payload?: Params): Observable<any> {

    const userToken = getStringDataFromLocalStorage("user_token");
    const userId = getStringDataFromLocalStorage("user_id");

    const headers = {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${userToken}`,
    };

    const apiUrl = `${environment.apiBaseUrl}/api/orderlist?user_id=${userId}`;
    return this.http.get<any>(apiUrl, { headers });
  };

  placeOrder(data: any): Observable<any> {

    const userToken = getStringDataFromLocalStorage("user_token");
    const userId = getStringDataFromLocalStorage("user_id");

    const headers = {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${userToken}`,
    };

    const apiUrl = `${environment.apiBaseUrl}/api/placeorder`;
    return this.http.post<any>(apiUrl, data, { headers });
  }

  getvieewwwOrders(order_id: any): Observable<any> {
    const userToken = getStringDataFromLocalStorage("user_token");
    const userId = getStringDataFromLocalStorage("user_id");

    const headers = {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${userToken}`,
    };

    const apiUrl = `${environment.apiBaseUrl}/api/ordertracklist?order_id=${order_id}`;
    return this.http.get<any>(apiUrl, { headers });
  }





  // getTrackOrdersList(order_id: any): Observable<any> {
  //   const userToken = getStringDataFromLocalStorage("user_token");
  //   const userId = getStringDataFromLocalStorage("user_id");

  //   const headers = {
  //     'Content-Type': 'application/json',
  //     'authorization': `Bearer ${userToken}`,
  //   };

  //   const apiUrl = `${environment.apiBaseUrl}/api/ordertracklist?order_id=${order_id}`;
  //   return this.http.get<any>(apiUrl, { headers });
  // }




}
