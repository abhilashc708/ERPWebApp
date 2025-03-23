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

filteredBills: any[] = [];  // Filtered bills for UI
  selectedDate: string = '';  // Store selected date
  selectedShop: string = '';

    constructor(private billService: BillService,
                       private dialog: MatDialog,
                        private snackBar: MatSnackBar) {}

      ngOnInit() {
                this.fetchBillsForToday();
            }


                 fetchBills() {
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

               // Fetch only today's bills by default
                 fetchBillsForToday() {
                   const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
                   this.billService.getBills().subscribe({
                     next: (data) => {
                       this.bills = data || [];
                       this.filteredBills = this.bills.filter(bill => bill.billingDate.startsWith(today)); // Show only today's bills
                     },
                     error: (error) => {
                       console.error('Error fetching bills:', error);
                     }
                   });
                 }

                 // Fetch all bills when searching by date
                 fetchBillsByDate() {
                   if (!this.selectedDate) {
                     this.fetchBillsForToday(); // Reset to today's bills if date is cleared
                     return;
                   }

                  this.filteredBills = this.bills.filter(bill => {
                    const matchesDate = this.selectedDate ? bill.billingDate.startsWith(this.selectedDate) : true;
                    const matchesShop = this.selectedShop ? bill.shop.name.toLowerCase().includes(this.selectedShop.toLowerCase()) : true;
                    return matchesDate && matchesShop;
                  });
                 }


// Compute total pages
totalPages(): number {
  return Math.ceil(this.filteredBills.length / this.billsPerPage);
}

// Get paginated data
pagedBills(): any[] {
  const startIndex = (this.currentPage - 1) * this.billsPerPage;
  return this.filteredBills.slice(startIndex, startIndex + this.billsPerPage);
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
              minWidth: '800px', // ✅ Ensures minimum width
              maxWidth: '90vw',  // ✅ Prevents dialog from being too large
              maxHeight: '90vh', // Limit max height to 90% of viewport height
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
           const dialogRef = this.dialog.open(InvoiceComponent, {
           width: 'auto', // Prevent full width
            data: { bill }  // ✅ Pass the bill object properly
            });
          }

        toggleSidebar() {
          const sidebar = document.getElementById('sidebar');
          sidebar?.classList.toggle('open');
        }

}
