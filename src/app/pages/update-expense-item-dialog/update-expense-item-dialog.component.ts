import { Component, Inject, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpenseCategoryService } from '../../services/expense-category.service';
import { CommonModule } from '@angular/common'; // ✅ Import this for *ngFor
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module

@Component({
  selector: 'app-update-expense-item-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './update-expense-item-dialog.component.html',
  styleUrl: './update-expense-item-dialog.component.css'
})
export class UpdateExpenseItemDialogComponent implements OnInit{

   expCategoryForm!: FormGroup;
   @Output() expCatUpdate = new EventEmitter<void>(); // ✅ Event to notify parent

   constructor(private dialogRef: MatDialogRef<UpdateExpenseItemDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any, // Receive shop data
                           private fb: FormBuilder,
                           private http: HttpClient,
                           private snackBar: MatSnackBar,
                           private expenseCategoryService: ExpenseCategoryService) {}
    ngOnInit() {
      this.expCategoryForm = this.fb.group({
      expenseItemName: [this.data.expenseItemName, Validators.required]
    });
  }

      // ✅ Save changes
       expCategoryUpdate() {
         if (this.expCategoryForm.valid) {
         this.expenseCategoryService.updateExpenseCategory(this.data.expenseItemId, this.expCategoryForm.value).subscribe({
          next: (response: any) => {
            console.log('Expense Category updated successfully:', response);
            // ✅ Show success message
            this.snackBar.open('Expense Category Updated successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
            this.expCatUpdate.emit(); // ✅ Notify parent to refresh grid
            this.dialogRef.close(true); // Close dialog and refresh list
          },
         error: (error: any) => {
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
