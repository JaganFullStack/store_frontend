import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AccountUser } from "../interface/account.interface";
import { getStringDataFromLocalStorage } from "src/app/utilities/helper";


@Injectable({
  providedIn: "root",
})
export class AccountService {

  constructor(private http: HttpClient) { }

  getUserDetails(): Observable<any> {
    const userToken = getStringDataFromLocalStorage("user_token");
    const userId = getStringDataFromLocalStorage("user_id");

    const headers = {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${userToken}`,
    };

    const apiUrl = `${environment.apiBaseUrl}/api/getCustomerdetails?user_id=${userId}`;

    return this.http.get<any>(apiUrl, { headers });
  }

}
