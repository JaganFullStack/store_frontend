import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { CartAddOrUpdate, CartModel } from "../interface/cart.interface";

@Injectable({
  providedIn: "root",
})
export class cartService {
  static getCartItems() {
    throw new Error('Method not implemented.');
  }
  static addToCart(params: CartAddOrUpdate) {
    throw new Error('Method not implemented.');
  }
  
  constructor(private http: HttpClient) {}



  // addToCart(item: any): Observable<CartModel> {
  //   return this.http.post<CartModel>(`http://localhost:8080/api/addcart`, item);
  // }


 
  getCartItems(): Observable<CartModel> {

    return this.http.get<CartModel>(`http://localhost:8080/api/getCartData`);

    
  }


  

   
  removecartItems(item: any): Observable<CartModel> {
    return this.http.post<CartModel>(`http://localhost:8080/api/removecart`,item);
  }


  deletecartitemItems(item: any): Observable<CartModel> {
    return this.http.post<CartModel>(`http://localhost:8080/api/deletecartitem`,item);
  } 





  addToCart(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'AUTHKEY': 'StoreWeb'
    });

    const url = 'http://localhost:8080/api/addcart';

    return this.http.post<any>(url, data, { headers: headers }).pipe(
        catchError((HttpErrorResponse: any) => {
          console.log(data);
console.log(HttpErrorResponse);
            return throwError(() => HttpErrorResponse);
      })
    );
  }


  

}
