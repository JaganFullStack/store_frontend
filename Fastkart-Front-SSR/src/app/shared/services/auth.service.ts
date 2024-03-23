import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthUserStateModel } from "./../interface/auth.interface";
import { Params } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) { }

  public redirectUrl: string | undefined;

  // Auth Function Here
  login(data: any): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      'AUTHKEY': 'StoreWeb'
    };

    const url = `${environment.apiBaseUrl}/api/login`;

    return this.http.post<any>(url, data, { headers: headers });
  }


  registration(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'AUTHKEY': 'StoreWeb'
    });

    const url = `${environment.apiBaseUrl}/api/register`; // Update with your endpoint

    return this.http.post<any>(url, data, { headers: headers });
  }

  verificationEmail(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'AUTHKEY': 'StoreWeb'
    });
    const apiUrl = `http://localhost:8080/verify-email?token=${data}`

    // Update with your endpoint

    return this.http.get<any>(apiUrl, { headers: headers }).pipe(
      catchError(HttpErrorResponse => {

        return throwError(() => HttpErrorResponse);
      })
    );
  }


  Emailvalidation(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'AUTHKEY': 'StoreWeb'
    });
    const apiUrl = `http://localhost:8080/api/emailValidaion?Email=${data}`

    // Update with your endpoint

    return this.http.get<any>(apiUrl, { headers: headers }).pipe(
      catchError(HttpErrorResponse => {

        return throwError(() => HttpErrorResponse);
      })
    );
  }

  isUpdatedUserPassword(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'AUTHKEY': 'StoreWeb'
    });

    const url = 'http://localhost:8080/api/updatedEmailPassword'; // Update with your endpoint

    return this.http.post<any>(url, data, { headers: headers }).pipe(
      catchError(HttpErrorResponse => {

        return throwError(() => HttpErrorResponse);
      })
    );
  }






}
