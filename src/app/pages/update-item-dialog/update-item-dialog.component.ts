import { Component, Inject, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { CommonModule } from '@angular/common'; // ✅ Import this for *ngFor
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { ShopService, Shop } from '../../services/shop.service';
import { CategoryService, Category } from '../../services/category.service';
import moment from 'moment';

@Component({
  selector: 'app-update-item-dialog',
  imports: [ CommonModule, ReactiveFormsModule, MatSnackBarModule ],
  templateUrl: './update-item-dialog.component.html',
  styleUrl: './update-item-dialog.component.css'
})
export class UpdateItemDialogComponent  implements OnInit{
 shops: any[] = []; // Store fetched shop data
    category: any[] = [];
   itemForm!: FormGroup;
   items: any[] = []; // Store fetched item data

   // ✅ Units options for dropdown
         availableUnits= [
           { label: 'Kg', value: 'Kg' },
           { label: 'Liter', value: 'Liter' },
           { label: 'Pcs', value: 'Pcs' },
           { label: 'Pkg', value: 'Pkg' }
         ];

   @Output() itemUpdated = new EventEmitter<void>(); // ✅ Event to notify parent

    constructor(private dialogRef: MatDialogRef<UpdateItemDialogComponent>,
       @Inject(MAT_DIALOG_DATA) public data: any, // Receive item data
                     private fb: FormBuilder,
                     private http: HttpClient,
                     private snackBar: MatSnackBar,
                     private itemService: ItemService,
                     private shopService: ShopService,
                     private categoryService: CategoryService) {}

 ngOnInit() {
        this.itemForm = this.fb.group({
           productName: [this.data.productName, Validators.required],
           categoryId: [this.data.category?.categoryId, Validators.required],
           quantity:[this.data.quantity, Validators.required],
            units:[this.data.units, Validators.required],
           actualPrice: [this.data.actualPrice, Validators.required],
           rate: [this.data.rate, Validators.required],
           mfdDate: [this.data.mfdDate, Validators.required],
           expDate: [this.data.expDate], // Not required
           shopId: [this.data.shop?.shopId, Validators.required]
        });
          this.fetchShops();
          this.fetchCategory();
      }

       fetchShops() {
              this.shopService.getShops().subscribe({
                  next: (data: any) => this.shops = data,  // Fix `.set()` issue
                  error: (err: any) => console.error('Error fetching shops:', err)
              });
          }

         fetchCategory() {
                  this.categoryService.getCategory().subscribe({
                      next: (data: any) => this.category = data,  // Fix `.set()` issue
                      error: (err: any) => console.error('Error fetching category:', err)
                  });
              }


            // ✅ Save changes
              updateItem() {
                if (this.itemForm.valid) {
             this.itemForm.patchValue({
            mfdDate: this.itemForm.get('mfdDate')?.value ? this.formatDate(this.itemForm.get('mfdDate')?.value) : null,
               expDate: this.itemForm.get('expDate')?.value ? this.formatDate(this.itemForm.get('expDate')?.value) : null
           });
                  this.itemService.updateItem(this.data.productId, this.itemForm.value).subscribe({
                    next: (response) => {
                       console.log('Item updated successfully:', response);
                       // ✅ Show success message
                       this.snackBar.open('Item Updated successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
                       this.itemUpdated.emit(); // ✅ Notify parent to refresh grid
                      this.dialogRef.close(true); // Close dialog and refresh list
                    },
                    error: (error) => {
                      console.error('Error updating item:', error);
                      this.snackBar.open('Failed to update item. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
                    }
                  });
                }
              }

             formatDate(dateString: string): string {
                        return moment(dateString).format('DD-MM-YYYY'); // ✅ Convert to `dd-MM-yyyy`
                      }

 closeDialog() {
    this.dialogRef.close();
  }
}
