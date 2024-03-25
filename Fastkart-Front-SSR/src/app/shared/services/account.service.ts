import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AccountUser, AccountUserUpdatePassword } from "../interface/account.interface";
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






  UpdateUserPassword(payload: AccountUserUpdatePassword): Observable<any> {
    const userToken = getStringDataFromLocalStorage("user_token");
    const userId = getStringDataFromLocalStorage("user_id");
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    };
  
    const apiUrl = `${environment.apiBaseUrl}/api/changepassword`;
  
    const body = {
      user_id: userId,
      old_password: payload.old_password,
      new_password: payload.new_password,
    };
  
    return this.http.post<any>(apiUrl, body, { headers });
  }
  
  
  

}
