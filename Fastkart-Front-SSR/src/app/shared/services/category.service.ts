import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { CategoryModel } from "../interface/category.interface";

@Injectable({
  providedIn: "root",
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(payload?: Params): Observable<any> {
    // return this.http.get<any>(`${environment.URL}/category.json`, { params: payload });
    const url = `${environment.apiBaseUrl}/api/getCategoriesdetails`;
    const headers = {
      'Content-Type': 'application/json',
      'AUTHKEY': 'StoreWeb'
    };

    return this.http.get<CategoryModel>(url, { headers });
  }

}