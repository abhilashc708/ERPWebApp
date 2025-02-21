import { Component, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { ExpenseCategoryService } from '../../services/expense-category.service';

@Component({
  selector: 'app-add-expense-item-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './add-expense-item-dialog.component.html',
  styleUrl: './add-expense-item-dialog.component.css'
})
export class AddExpenseItemDialogComponent implements OnInit{

 expCategoryForm!: FormGroup;
 @Output() expCatAdded = new EventEmitter<void>(); // ✅ Event to notify parent

 constructor(private dialogRef: MatDialogRef<AddExpenseItemDialogComponent>,
                         private fb: FormBuilder,
                         private http: HttpClient,
                         private snackBar: MatSnackBar,
                         private expenseCategoryService: ExpenseCategoryService) {}
  ngOnInit() {
                              this.expCategoryForm = this.fb.group({
                                expenseItemName: ['', Validators.required]
                              });
                            }


  saveExpenseCategory() {
    if (this.expCategoryForm.valid) {
      const formData = { ...this.expCategoryForm.value };
       console.log('Expense Category data:', formData);

       // ✅ Save category using service
        this.expenseCategoryService.saveExpenseCategory(formData).subscribe({
        next: (response) => {
        console.log('Expense Category saved successfully:', response);
        // ✅ Show success message
        this.snackBar.open('Expense Category added successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
         this.expCatAdded.emit(); // ✅ Notify parent to refresh grid
         this.dialogRef.close(true);
         },
         error: (error) => {
           console.error('Error saving user:', error);
           this.snackBar.open('Failed to add expense category. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
          }
        });
      }
    }

  closeDialog() {
   this.dialogRef.close();
     }

}
