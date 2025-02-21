import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GenerateBillComponent } from '../generate-bill/generate-bill.component';
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { BillService, Bill } from '../../services/bill.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, MatSnackBarModule ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
   constructor(private dialog: MatDialog,
     private snackBar: MatSnackBar) {}

 toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('open');
  }
  openAddBillDialog() {
    const dialogRef = this.dialog.open(GenerateBillComponent, {
    width: '750px',  // Set width
    maxHeight: '100vh', // Limit max height to 90% of viewport height
    autoFocus: false, // Prevents automatic focus on the first input field
    });

    dialogRef.afterClosed().subscribe((result: any) => {
     if (result) {
      console.log("Bill added:", result);
      }
     });
   }


   openAddExpenseDialog() {
     const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
       autoFocus: false, // Prevents automatic focus on the first input field
     });

    dialogRef.afterClosed().subscribe((result: any) => {
     if (result) {
      console.log("Expense added:", result);
      }
    });
  }
}
