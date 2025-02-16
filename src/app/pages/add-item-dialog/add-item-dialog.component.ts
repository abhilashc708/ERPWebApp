import { Component, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { ItemService } from '../../services/item.service';
import { ShopService, Shop } from '../../services/shop.service';
import { CategoryService, Category } from '../../services/category.service';
import moment from 'moment';


@Component({
  selector: 'app-add-item-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './add-item-dialog.component.html',
  styleUrl: './add-item-dialog.component.css'
})
export class AddItemDialogComponent implements OnInit{
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

    @Output() itemAdded = new EventEmitter<void>(); // ✅ Event to notify parent

    constructor(private dialogRef: MatDialogRef<AddItemDialogComponent>,
                  private fb: FormBuilder,
                  private http: HttpClient,
                  private snackBar: MatSnackBar,
                  private itemService: ItemService,
                  private shopService: ShopService,
                  private categoryService: CategoryService) {}

    ngOnInit() {
        this.itemForm = this.fb.group({
           productName: ['', Validators.required],
           categoryId: ['', Validators.required],
           quantity:['', Validators.required],
           units:['', Validators.required],
           actualPrice: ['', Validators.required],
           rate: ['', Validators.required],
           mfdDate: ['', Validators.required],
           expDate: [''], // Not required
           shopId: ['', Validators.required]
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

        saveItem() {
            if (this.itemForm.valid) {
            const formData = { ...this.itemForm.value };
              console.log('Item data:', formData);
                formData.mfdDate = this.formatDate(formData.mfdDate);
                formData.expDate = formData.expDate ? this.formatDate(formData.expDate) : null;

               // ✅ Save item using service
                    this.itemService.saveItem(formData).subscribe({
                      next: (response) => {
                        console.log('Item saved successfully:', response);
                         // ✅ Show success message
                        this.snackBar.open('Item added successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
                        this.itemAdded.emit(); // ✅ Notify parent to refresh grid
                        this.dialogRef.close(true);
                      },
                      error: (error) => {
                        console.error('Error saving user:', error);
                        this.snackBar.open('Failed to add user. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
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
