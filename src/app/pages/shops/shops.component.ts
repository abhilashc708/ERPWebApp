import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShopService, Shop } from '../../services/shop.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddShopDialogComponent } from '../add-shop-dialog/add-shop-dialog.component';
import { UpdateShopDialogComponent } from '../update-shop-dialog/update-shop-dialog.component';
import { NgFor } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-shops',
  imports: [RouterModule, CommonModule, FormsModule, NgFor, MatSnackBarModule],
  templateUrl: './shops.component.html',
  styleUrl: './shops.component.css'
})
export class ShopsComponent implements OnInit{
   shops: Shop[] = []; // ✅ Correct type
 currentPage: number = 1;
    shopsPerPage: number = 5;

    constructor(private shopService: ShopService,
                private dialog: MatDialog,
                 private snackBar: MatSnackBar) {}

 ngOnInit() {
        this.fetchShops();
    }

fetchShops() {
    this.shopService.getShops().subscribe({
        next: (data: any) => this.shops = data,  // Fix `.set()` issue
        error: (err: any) => console.error('Error fetching shops:', err)
    });
  console.log('shop-->', this.shops);
}

  totalPages() {
            return Math.ceil(this.shops.length / this.shopsPerPage);
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

       openAddShopDialog() {
              const dialogRef = this.dialog.open(AddShopDialogComponent, {
                width: '400px'
              });

              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  console.log("Shop added:", result);
                   this.fetchShops();
                }
              });
            }

           // ✅ Open edit popup
           openEditDialog(shop: any) {
             const dialogRef = this.dialog.open(UpdateShopDialogComponent, {
             width: '400px',
             data: shop // Pass shop data to dialog
            });

             // Refresh shop list after update
            dialogRef.afterClosed().subscribe((result) => {
             if (result) {
             console.log("Shop Updated:", result);
             this.fetchShops();
             }
           });
         }

         // ✅ Delete popup
         openDeleteDialog(shop: any, event: MouseEvent): void {
          const dialogRef = this.dialog.open(DeleteDialogComponent, {
           width: '400px',
            data: { name: shop.name },
         });

        dialogRef.afterClosed().subscribe((confirmed) => {
         if (confirmed) {
          this.deleteShop(shop.shopId);
          }
        });
      }

        deleteShop(shopId: number) {
          this.shopService.deleteShop(shopId).subscribe({
          next: (response) => {
            console.log('Delete Response:', response);
            this.snackBar.open('Shop Deleted successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
            this.fetchShops(); // Refresh user list after deletion
         },
          error: (err) => {
             console.error('Error deleting user:', err);
              this.snackBar.open('Failed to delete shop. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
             }
           });
         }

          toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar?.classList.toggle('open');
          }
}
