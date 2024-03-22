import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { ProductModel } from "../interface/product.interface";

@Injectable({
  providedIn: "root",
})
export class SearchService {

  constructor(private http: HttpClient) {}

  searchProduct(payload?: Params): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${environment.URL}/product.json`, { params: payload });
    // return this.http.get<ProductModel>(`http://localhost:8080/api/getproduct`,{ params: payload })
  }
  
}