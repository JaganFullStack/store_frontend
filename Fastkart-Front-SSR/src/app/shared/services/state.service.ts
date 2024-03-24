import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { States } from "../interface/state.interface";

@Injectable({
  providedIn: "root",
})
export class StateService {

  constructor(private http: HttpClient) {}

  getStates(): Observable<any> {
    // const userToken = getStringDataFromLocalStorage("user_token");
    // const userId = getStringDataFromLocalStorage("user_id");

    const headers = {
      'Content-Type': 'application/json',
      // 'authorization': `Bearer ${userToken}`,
    };

    const apiUrl = `${environment.apiBaseUrl}/api/getstatesdetails`;

    return this.http.get<any>(apiUrl, { headers });
  }

}
