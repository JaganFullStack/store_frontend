import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductModel } from '../interface/product.interface';
import { Params } from '../interface/core.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public skeletonLoader: boolean = false;

  constructor(private http: HttpClient) { }

  getProducts(payload?: Params): Observable<any> {
    // return this.http.get<ProductModel>(`${environment.URL}/product.json`, { params: payload });
    const url = `${environment.apiBaseUrl}/api/getProductsdetails`;

    const headers = {
      'Content-Type': 'application/json',
      'AUTHKEY': 'StoreWeb'
    };

    return this.http.get<any>(url, {headers});
  }

}
