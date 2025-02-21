import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExpenseService, Expense } from '../../services/expense.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgFor } from '@angular/common';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';
import { UpdateExpenseDialogComponent } from '../update-expense-dialog/update-expense-dialog.component';

@Component({
  selector: 'app-expense',
  imports: [RouterModule, CommonModule, FormsModule, NgFor, MatSnackBarModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit{

  currentPage: number = 1;
  expensesPerPage: number = 5;

   expenses = signal<Expense[]>([]); // Angular 19 Signal

   constructor(private expenseService: ExpenseService,
                      private dialog: MatDialog,
                       private snackBar: MatSnackBar) {}

     ngOnInit() {
              this.fetchExpenses();
          }

         fetchExpenses() {
                this.expenseService.getExpenses().subscribe({
                    next: (data) => this.expenses.set(data),
                    error: (err) => console.error('Error fetching Expenses:', err)
                });
            }

          totalPages() {
                  return Math.ceil(this.expenses.length / this.expensesPerPage);
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

         openAddExpenseDialog() {
            const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
            width: '400px'
            });

           dialogRef.afterClosed().subscribe(result => {
            if (result) {
            console.log("Item added:", result);
             this.fetchExpenses();
             }
            });
          }

    // ✅ Open edit popup
         openEditDialog(expenses: any) {
           const dialogRef = this.dialog.open(UpdateExpenseDialogComponent, {
             width: '400px',
             data: expenses // Pass user data to dialog
           });

           // Refresh user list after update
           dialogRef.afterClosed().subscribe((result) => {
             if (result) {
                console.log("User Updated:", result);
               this.fetchExpenses();
             }
           });
         }

// ✅ Delete popup
      openDeleteDialog(expense: any, event: MouseEvent): void {
       const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '400px',
        data: { name: expense.expenseItem.expenseItemName },
        });

         dialogRef.afterClosed().subscribe((confirmed) => {
         if (confirmed) {
          this.deleteExpense(expense.expenseId);
            }
          });
        }

         deleteExpense(expenseId: number) {
          this.expenseService.deleteExpense(expenseId).subscribe({
           next: (response) => {
            console.log('Delete Response:', response);
             this.snackBar.open('Expense Deleted successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
             this.fetchExpenses(); // Refresh user list after deletion
           },
         error: (err) => {
          console.error('Error deleting user:', err);
           this.snackBar.open('Failed to delete expense. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
           }
         });
       }

toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
   sidebar?.classList.toggle('open');
  }
}
