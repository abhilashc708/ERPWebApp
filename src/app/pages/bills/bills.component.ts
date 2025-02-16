import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemService, Item } from '../../services/item.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgFor } from '@angular/common';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { BillService, Bill } from '../../services/bill.service';
import { GenerateBillComponent } from '../generate-bill/generate-bill.component';
import { InvoiceComponent } from '../invoice/invoice.component';

@Component({
  selector: 'app-bills',
  imports: [ RouterModule, CommonModule, FormsModule, NgFor, MatSnackBarModule ],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.css'
})
export class BillsComponent implements OnInit{
 currentPage: number = 1;
   billsPerPage: number = 8;
bills: any[] = []; //
    //bills = signal<Bill[]>([]); // Angular 19 Signal

    constructor(private billService: BillService,
                       private dialog: MatDialog,
                        private snackBar: MatSnackBar) {}

      ngOnInit() {
                this.fetchBills();
            }


                 fetchBills() {
                   debugger;
                   this.billService.getBills().subscribe({
                     next: (data) => {
                       this.bills = data || []; // Ensure it's never undefined
                     },
                     error: (error) => {
                       console.error('Error fetching bills:', error);
                     }
                   });
                 console.log('data-->', this.bills);
                 }

// Compute total pages
totalPages(): number {
  return Math.ceil(this.bills.length / this.billsPerPage);
}

// Get paginated data
pagedBills(): any[] {
  const startIndex = (this.currentPage - 1) * this.billsPerPage;
  return this.bills.slice(startIndex, startIndex + this.billsPerPage);
}

// Next page
nextPage() {
  if (this.currentPage < this.totalPages()) {
    this.currentPage++;
  }
}

// Previous page
prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}
                     openAddBillDialog() {
                                         const dialogRef = this.dialog.open(GenerateBillComponent, {
                                           width: '750px',  // Set width
                                               maxHeight: '100vh', // Limit max height to 90% of viewport height
                                               autoFocus: false, // Prevents automatic focus on the first input field
                                               panelClass: 'custom-dialog-container' // Add custom CSS class
                                         });

                                         dialogRef.afterClosed().subscribe(result => {
                                           if (result) {
                                             console.log("Bill added:", result);
                                              this.fetchBills();
                                           }
                                         });
                                       }

                                     printInvoice(bill: any) {
                                       debugger;
                                       const dialogRef = this.dialog.open(InvoiceComponent, {
                                         width: 'auto', // Prevent full width
                                        data: { bill }  // ✅ Pass the bill object properly
                                       });
                                     }

}
