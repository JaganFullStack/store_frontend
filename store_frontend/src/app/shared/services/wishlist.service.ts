import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WishlistModel } from '../interface/wishlist.interface';
import { getStringDataFromLocalStorage } from 'src/app/utilities/helper';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  public skeletonLoader: boolean = false;

  constructor(private http: HttpClient) { }

  getWishlistItems(): Observable<any> {
    const userToken = getStringDataFromLocalStorage("user_token");
    const userId = getStringDataFromLocalStorage("user_id");

    const headers = {
      'Content-Type': 'application/json',
      'AUTHKEY': 'StoreWeb',
      'authorization': `Bearer ${userToken}`
    };

    const url = `${environment.apiBaseUrl}/api/wishlist?user_id=${userId}`;

    return this.http.get<any>(url, { headers });
  }

  addOrRemoveWishlist(data: any): Observable<any> {
    const userToken = getStringDataFromLocalStorage("user_token");
    const headers = {
      'Content-Type': 'application/json',
      'AUTHKEY': 'StoreWeb',
      'authorization': `Bearer ${userToken}`
    };

    const url = `${environment.apiBaseUrl}/api/adddelwish`;

    return this.http.post<any>(url, data, { headers: headers });
  }

}
