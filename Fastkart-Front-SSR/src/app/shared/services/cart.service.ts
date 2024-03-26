import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { CartAddOrUpdate, CartModel } from "../interface/cart.interface";
import { getStringDataFromLocalStorage } from "src/app/utilities/helper";

@Injectable({
  providedIn: "root",
})
export class cartService {
  // static getCartItems() {
  //   throw new Error('Method not implemented.');
  // }
  // static addToCart(params: CartAddOrUpdate) {
  //   throw new Error('Method not implemented.');
  // }

  constructor(private http: HttpClient) { }

  getCartItems(): Observable<any> {
    const userToken = getStringDataFromLocalStorage("user_token");
    const userId = getStringDataFromLocalStorage("user_id");

    const url = `${environment.apiBaseUrl}/api/getcart?user_id=${userId}`;

    const headers = {
      'Content-Type': 'application/json',
      'AUTHKEY': 'StoreWeb',
      'authorization': `Bearer ${userToken}`,
    };

    return this.http.get<any>(url, { headers });
  }

  deletecartitemItems(item: any): Observable<CartModel> {
    return this.http.post<CartModel>(`http://localhost:8080/api/deletecartitem`, item);
  }

  addToCart(data: any): Observable<any> {

    const userToken = getStringDataFromLocalStorage("user_token");

    const headers = {
      'Content-Type': 'application/json',
      'AUTHKEY': 'StoreWeb',
      'authorization': `Bearer ${userToken}`,
    };

    const url = `${environment.apiBaseUrl}/api/addcart`;;

    return this.http.post<any>(url, data, { headers });
  };

  removeFromCart(data: any): Observable<any> {

    const userToken = getStringDataFromLocalStorage("user_token");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'AUTHKEY': 'StoreWeb',
      'authorization': `Bearer ${userToken}`,
    });

    const url = `${environment.apiBaseUrl}/api/delcart`;

    return this.http.post<any>(url, data, { headers: headers });
  };

  bulkAddCart(data: any): Observable<any> {

    const userToken = getStringDataFromLocalStorage("user_token");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'AUTHKEY': 'StoreWeb',
      'authorization': `Bearer ${userToken}`,
    });

    const url = `${environment.apiBaseUrl}/api/addcartlocal`;

    return this.http.post<any>(url, data, { headers: headers });
  };

}
