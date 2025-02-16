import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Shop {
    id: number;
    name: string;
    email: string;
    address: string;
    location: string;
    phone: string;
}

@Injectable({
  providedIn: 'root'
})

export class ShopService {

    private apiUrl = `${environment.apiBaseUrl}/api/admin`;
        private http = inject(HttpClient); // Angular 19 inject method

constructor() { }

// ✅ Get shop
getShops(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/shop`);
  }


// ✅ Save new shop
  saveShop(shopData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/shop/create`, shopData);
  }

// ✅ Update shop function
  updateShop(id: number, shopData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/shop/${id}`, shopData);
  }
// ✅ Delete shop function
 deleteShop(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/shop/${id}`);
  }

}
