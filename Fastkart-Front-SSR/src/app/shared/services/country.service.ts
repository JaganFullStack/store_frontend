import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Country } from "../interface/country.interface";
import { getStringDataFromLocalStorage } from "src/app/utilities/helper";

@Injectable({
  providedIn: "root",
})
export class CountryService {

  constructor(private http: HttpClient) {}

  getCountries(): Observable<any> {
    // const userToken = getStringDataFromLocalStorage("user_token");

    const headers = {
      'Content-Type': 'application/json',
      // 'authorization': `Bearer ${userToken}`,
    };

    const apiUrl = `${environment.apiBaseUrl}/api/getcountriesdetails`;

    return this.http.get<any>(apiUrl, { headers });
  }

  getCities(): Observable<any> {

    const headers = {
      'Content-Type': 'application/json',
      // 'authorization': `Bearer ${userToken}`,
    };

    const apiUrl = `${environment.apiBaseUrl}/api/getcitiesdetails`;

    return this.http.get<any>(apiUrl, { headers });
  }

}
