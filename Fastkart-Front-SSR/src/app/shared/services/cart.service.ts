import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { CartModel } from "../interface/cart.interface";

@Injectable({
  providedIn: "root",
})
export class CartService {
  
  constructor(private http: HttpClient) {}



  addToCart(item: any): Observable<CartModel> {
    return this.http.post<CartModel>(`http://localhost:8080/api/addcart`, item);
  }

 
  getCartItems(): Observable<CartModel> {
    return this.http.get<CartModel>(`http://localhost:8080/api/getCartData`);
  }

}
