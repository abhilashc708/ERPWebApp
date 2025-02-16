import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// export interface Shop {
//     shopId: number;
//     name: string;
//     email: string;
//     address: string;
//     location: string;
//     phone: string;
// }
//
// export interface Item {
//      itemId: number;
//         productName: string;
//         categoryId: number;
//         quantity: string;
//         actualPrice: string;
//         rate: string;
//         mfdDate: Date;
//         expDate: Date;
//         shopId: number;
//         shop: Shop;
// }
// export interface Bill {
//   billId: number;
//   billCode: string;
//   billingDate: Date;
//   phone: string;
//   quantity: number;
//   rate: number;
//   shopId: number;
//   itemId: number;
//   shop: Shop;
//   item: Item;
//   paymentMethod: string;
//   categoryId: number;
//   }


export interface Bill {
  billId: number;
  billCode: string;
  phone: string;
  paymentMethod: string;
  billingDate: Date;
  shopId: number;
  shop: {
    shopId: number;
    name: string;
    phone: string;
    location: string;
    address: string;
    email: string;
  };
  items: BillItem[];  // ✅ Ensure this is defined
}

export interface BillItem {
  id: number;
  product: {
    productId: number;
    productName: string;
  };
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private apiUrl = `${environment.apiBaseUrl}/api/user`;
          private http = inject(HttpClient); // Angular 19 inject method

          // ✅ Get shop
                  getBills(): Observable<any> {
                      return this.http.get<any>(`${this.apiUrl}/bill`);
                    }

                  // ✅ Save new Bill
                    saveBill(itemData: any): Observable<any> {
                      return this.http.post(`${this.apiUrl}/bill/create`, itemData);
                    }
//
//                   // ✅ Update item function
//                     updateItem(id: number, itemData: any): Observable<any> {
//                       return this.http.put(`${this.apiUrl}/product/${id}`, itemData);
//                     }
//
//                   // ✅ Delete shop function
//                    deleteItem(id: number): Observable<void> {
//                       return this.http.delete<void>(`${this.apiUrl}/product/${id}`);
//                     }

  constructor() { }
}
