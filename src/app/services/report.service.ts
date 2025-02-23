import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

 private apiUrl = `${environment.apiBaseUrl}/api/admin`;
 private http = inject(HttpClient); // Angular 19 inject method

    constructor() {}

    getReports(startDate: string, endDate: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/report?startDate=${startDate}&endDate=${endDate}`);
    }
}
