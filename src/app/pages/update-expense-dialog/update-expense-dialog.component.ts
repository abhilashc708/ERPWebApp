import { Component, Inject, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpenseCategoryService } from '../../services/expense-category.service';
import { ShopService } from '../../services/shop.service';
import { ExpenseService } from '../../services/expense.service';
import { CommonModule } from '@angular/common'; // ✅ Import this for *ngFor
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module

@Component({
  selector: 'app-update-expense-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './update-expense-dialog.component.html',
  styleUrl: './update-expense-dialog.component.css'
})
export class UpdateExpenseDialogComponent implements OnInit{

   paymentMethods = ['Cash', 'UPI','Credit Card', 'Debit Card', 'Net Banking'];
      shops: any[] = []; // Store fetched shop data
        expenseCategory: any[] = [];
       expenseForm!: FormGroup;

       @Output() expenseUpdated = new EventEmitter<void>(); // ✅ Event to notify parent

      constructor(private dialogRef: MatDialogRef<UpdateExpenseDialogComponent>,
         @Inject(MAT_DIALOG_DATA) public data: any, // Receive item data
                        private fb: FormBuilder,
                        private http: HttpClient,
                        private snackBar: MatSnackBar,
                        private shopService: ShopService,
                        private expenseCategoryService: ExpenseCategoryService,
                        private expenseService: ExpenseService) {}

      ngOnInit() {
                  this.expenseForm = this.fb.group({
                     expenseItemId: [this.data.expenseItem?.expenseItemId, Validators.required],
                     rate:[this.data.rate, Validators.required],
                     paymentMethod:[this.data.paymentMethod, Validators.required],
                     shopId: [this.data.shop?.shopId, Validators.required]
                  });
                    this.fetchShops();
                    this.fetchExpenseCategory();
                }
      fetchShops() {
                this.shopService.getShops().subscribe({
                    next: (data: any) => this.shops = data,  // Fix `.set()` issue
                    error: (err: any) => console.error('Error fetching shops:', err)
                });
            }
           fetchExpenseCategory() {
                   this.expenseCategoryService.getExpenseCategory().subscribe({
                       next: (data: any) => this.expenseCategory = data,  // Fix `.set()` issue
                       error: (err: any) => console.error('Error fetching Expense category:', err)
                   });
               }

 // ✅ Save changes
    updateExpense() {
    if (this.expenseForm.valid) {
     this.expenseService.updateExpense(this.data.expenseId, this.expenseForm.value).subscribe({
      next: (response) => {
      console.log('Expense updated successfully:', response);
       // ✅ Show success message
       this.snackBar.open('Expense Updated successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
       this.expenseUpdated.emit(); // ✅ Notify parent to refresh grid
       this.dialogRef.close(true); // Close dialog and refresh list
       },
      error: (error) => {
       console.error('Error updating user:', error);
       this.snackBar.open('Failed to update category. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
      }
    });
  }
}

  closeDialog() {
     this.dialogRef.close();
    }
}
