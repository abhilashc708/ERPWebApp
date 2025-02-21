import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExpenseCategoryService, ExpenseCategory } from '../../services/expense-category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgFor } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
 import { AddExpenseItemDialogComponent } from '../add-expense-item-dialog/add-expense-item-dialog.component';
 import { UpdateExpenseItemDialogComponent } from '../update-expense-item-dialog/update-expense-item-dialog.component';

@Component({
  selector: 'app-expense-category',
  imports: [RouterModule, CommonModule, FormsModule, NgFor, MatSnackBarModule],
  templateUrl: './expense-category.component.html',
  styleUrl: './expense-category.component.css'
})
export class ExpenseCategoryComponent implements OnInit{
expenseCategory: ExpenseCategory[] = [];
currentPage: number = 1;
categoryPerPage: number = 5;

constructor(private expenseCategoryService: ExpenseCategoryService,
                private dialog: MatDialog,
                 private snackBar: MatSnackBar) {}

  ngOnInit() {
             this.fetchExpenseCategory();
         }

     fetchExpenseCategory() {
         this.expenseCategoryService.getExpenseCategory().subscribe({
             next: (data: any) => this.expenseCategory = data,  // Fix `.set()` issue
             error: (err: any) => console.error('Error fetching Expense category:', err)
         });
     }

     openAddExpCategoryDialog() {
      const dialogRef = this.dialog.open(AddExpenseItemDialogComponent, {
        width: '400px'
      });

      dialogRef.afterClosed().subscribe(result => {
      if (result) {
       console.log("Expense Category added:", result);
        this.fetchExpenseCategory();
       }
       });
     }

         // ✅ Open edit popup
          openEditExpCategoryDialog(expenseCategory: any) {
            const dialogRef = this.dialog.open(UpdateExpenseItemDialogComponent, {
              width: '400px',
              data: expenseCategory // Pass Category data to dialog
            });

           // Refresh shop list after update
            dialogRef.afterClosed().subscribe((result) => {
            if (result) {
             console.log("Expense Category Updated:", result);
              this.fetchExpenseCategory();
             }
             });
           }

     totalPages() {
                 return Math.ceil(this.expenseCategory.length / this.categoryPerPage);
             }

             nextPage() {
                 if (this.currentPage < this.totalPages()) {
                     this.currentPage++;
                 }
             }

             prevPage() {
                 if (this.currentPage > 1) {
                     this.currentPage--;
                 }
             }

           // ✅ Delete popup
            openDeleteDialog(expenseCategory: any, event: MouseEvent): void {
             const dialogRef = this.dialog.open(DeleteDialogComponent, {
               width: '400px',
               data: { name: expenseCategory.expenseItemName },
            });

            dialogRef.afterClosed().subscribe((confirmed) => {
              if (confirmed) {
                this.deleteCategory(expenseCategory.expenseItemId);
             }
            });
          }

          deleteCategory(expenseItemId: number) {
            this.expenseCategoryService.deleteExpCategory(expenseItemId).subscribe({
              next: (response: any) => {
              console.log('Delete Response:', response);
              this.snackBar.open('Expense Category Deleted successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
               this.fetchExpenseCategory(); // Refresh user list after deletion
              },
             error: (err: any) => {
             console.error('Error deleting user:', err);
             this.snackBar.open('Failed to delete expense category. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
            }
          });
        }

           toggleSidebar() {
             const sidebar = document.getElementById('sidebar');
             sidebar?.classList.toggle('open');
            }

}
