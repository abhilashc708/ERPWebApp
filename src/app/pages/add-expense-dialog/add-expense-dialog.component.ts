import { Component, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { ExpenseService } from '../../services/expense.service';
import { ShopService, Shop } from '../../services/shop.service';
import { ExpenseCategoryService, ExpenseCategory } from '../../services/expense-category.service';
import moment from 'moment';

@Component({
  selector: 'app-add-expense-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './add-expense-dialog.component.html',
  styleUrl: './add-expense-dialog.component.css'
})
export class AddExpenseDialogComponent implements OnInit{
   paymentMethods = ['Cash', 'UPI','Credit Card', 'Debit Card', 'Net Banking'];
    shops: any[] = []; // Store fetched shop data
      expenseCategory: any[] = [];
     expenseForm!: FormGroup;

     @Output() expenseAdded = new EventEmitter<void>(); // ✅ Event to notify parent

    constructor(private dialogRef: MatDialogRef<AddExpenseDialogComponent>,
                      private fb: FormBuilder,
                      private http: HttpClient,
                      private snackBar: MatSnackBar,
                      private shopService: ShopService,
                      private expenseCategoryService: ExpenseCategoryService,
                      private expenseService: ExpenseService) {}

     ngOnInit() {
            this.expenseForm = this.fb.group({
               expenseItemId: ['', Validators.required],
               rate:['', Validators.required],
               paymentMethod:['', Validators.required],
               shopId: ['', Validators.required]
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

  saveExpense() {
              if (this.expenseForm.valid) {
              const formData = { ...this.expenseForm.value };
                console.log('Expense data:', formData);

                 // ✅ Save item using service
                      this.expenseService.saveExpense(formData).subscribe({
                        next: (response) => {
                          console.log('Expense saved successfully:', response);
                           // ✅ Show success message
                          this.snackBar.open('Expense added successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
                          this.expenseAdded.emit(); // ✅ Notify parent to refresh grid
                          this.dialogRef.close(true);
                        },
                        error: (error) => {
                          console.error('Error saving user:', error);
                          this.snackBar.open('Failed to add user. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
                        }
                      });
              }
            }

     closeDialog() {
              this.dialogRef.close();
            }
}
