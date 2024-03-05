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

  constructor(private http: HttpClient) {}

  getProducts(payload?: Params): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${environment.URL}/product.json`, { params: payload });

    //  return this.http.get<ProductModel>(`http://localhost:8080/api/getproduct`,{ params: payload })
  }

}
