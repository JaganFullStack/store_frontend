import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AccountUser } from "../interface/account.interface";


@Injectable({
  providedIn: "root",
})
export class AccountService {

  constructor(private http: HttpClient) {}

  getUserDetails(): Observable<AccountUser> {
    const email=localStorage.getItem('UserEmail');
    const apiUrl = `http://localhost:8080/api/getCustomerData?Email=${email}`
    // return this.http.get<AccountUser>(`${environment.URL}/account.json`);
    return this.http.get<AccountUser>(apiUrl);
  }

}
