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
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { UpdateItemDialogComponent } from '../update-item-dialog/update-item-dialog.component';

@Component({
  selector: 'app-items',
  imports: [RouterModule, CommonModule, FormsModule, NgFor, MatSnackBarModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit{
   currentPage: number = 1;
   itemsPerPage: number = 5;

   items = signal<Item[]>([]); // Angular 19 Signal

     constructor(private itemService: ItemService,
                   private dialog: MatDialog,
                    private snackBar: MatSnackBar) {}

       ngOnInit() {
           this.fetchItems();
       }

      fetchItems() {
             this.itemService.getItems().subscribe({
                 next: (data) => this.items.set(data),
                 error: (err) => console.error('Error fetching users:', err)
             });
         }

       totalPages() {
               return Math.ceil(this.items.length / this.itemsPerPage);
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


    openAddItemDialog() {
                  const dialogRef = this.dialog.open(AddItemDialogComponent, {
                    width: '400px'
                  });

                  dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                      console.log("Item added:", result);
                       this.fetchItems();
                    }
                  });
                }

               // ✅ Open edit popup
                    openEditDialog(item: any) {
                      const dialogRef = this.dialog.open(UpdateItemDialogComponent, {
                        width: '400px',
                        data: item // Pass item data to dialog
                      });

                      // Refresh user list after update
                      dialogRef.afterClosed().subscribe((result) => {
                        if (result) {
                           console.log("User Updated:", result);
                          this.fetchItems();
                        }
                      });
                    }

                  // ✅ Delete popup
                      openDeleteDialog(item: any, event: MouseEvent): void {
                          const dialogRef = this.dialog.open(DeleteDialogComponent, {
                            width: '400px',
                            data: { name: item.productName },
                          });

                          dialogRef.afterClosed().subscribe((confirmed) => {
                            if (confirmed) {
                              this.deleteUser(item.productId);
                            }
                          });
                        }

                    deleteUser(productId: number) {
                      this.itemService.deleteItem(productId).subscribe({
                        next: (response) => {
                          console.log('Delete Response:', response);
                            this.snackBar.open('Item Deleted successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
                          this.fetchItems(); // Refresh user list after deletion
                        },
                        error: (err) => {
                          console.error('Error deleting user:', err);
                          this.snackBar.open('Failed to delete item. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
                        }
                      });
                    }

}
