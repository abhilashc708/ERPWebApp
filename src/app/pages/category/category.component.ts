import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryService, Category } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgFor } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';
import { UpdateCategoryDialogComponent } from '../update-category-dialog/update-category-dialog.component';


@Component({
  selector: 'app-category',
  imports: [RouterModule, CommonModule, FormsModule, NgFor, MatSnackBarModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{
   category: Category[] = [];
   currentPage: number = 1;
   categoryPerPage: number = 5;

    constructor(private categoryService: CategoryService,
                private dialog: MatDialog,
                 private snackBar: MatSnackBar) {}

     ngOnInit() {
            this.fetchCategory();
        }

    fetchCategory() {
        this.categoryService.getCategory().subscribe({
            next: (data: any) => this.category = data,  // Fix `.set()` issue
            error: (err: any) => console.error('Error fetching category:', err)
        });
    }

  totalPages() {
              return Math.ceil(this.category.length / this.categoryPerPage);
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

        openAddCategoryDialog() {
                      const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
                        width: '400px'
                      });

                      dialogRef.afterClosed().subscribe(result => {
                        if (result) {
                          console.log("Shop added:", result);
                           this.fetchCategory();
                        }
                      });
                    }


       // ✅ Open edit popup
                      openEditDialog(category: any) {
                        const dialogRef = this.dialog.open(UpdateCategoryDialogComponent, {
                          width: '400px',
                          data: category // Pass Category data to dialog
                        });

                        // Refresh shop list after update
                        dialogRef.afterClosed().subscribe((result) => {
                          if (result) {
                             console.log("Category Updated:", result);
                            this.fetchCategory();
                          }
                        });
                      }

      // ✅ Delete popup
                        openDeleteDialog(category: any, event: MouseEvent): void {
                            const dialogRef = this.dialog.open(DeleteDialogComponent, {
                              width: '400px',
                              data: { name: category.category },
                            });

                            dialogRef.afterClosed().subscribe((confirmed) => {
                              if (confirmed) {
                                this.deleteCategory(category.categoryId);
                              }
                            });
                          }

                      deleteCategory(categoryId: number) {
                        this.categoryService.deleteCategory(categoryId).subscribe({
                          next: (response) => {
                            console.log('Delete Response:', response);
                              this.snackBar.open('Category Deleted successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
                            this.fetchCategory(); // Refresh user list after deletion
                          },
                          error: (err) => {
                            console.error('Error deleting user:', err);
                            this.snackBar.open('Failed to delete category. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
                          }
                        });
                      }


}
