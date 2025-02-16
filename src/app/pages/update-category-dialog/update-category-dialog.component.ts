import { Component, Inject, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common'; // ✅ Import this for *ngFor
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module


@Component({
  selector: 'app-update-category-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './update-category-dialog.component.html',
  styleUrl: './update-category-dialog.component.css'
})
export class UpdateCategoryDialogComponent implements OnInit{
   categoryForm!: FormGroup;  // ✅ Define userForm

     @Output() categoryUpdated = new EventEmitter<void>(); // ✅ Event to notify parent

     constructor(private dialogRef: MatDialogRef<UpdateCategoryDialogComponent>,
       @Inject(MAT_DIALOG_DATA) public data: any, // Receive shop data
                     private fb: FormBuilder,
                     private http: HttpClient,
                     private snackBar: MatSnackBar,
                     private categoryService: CategoryService) {}

        ngOnInit() {
                                                this.categoryForm = this.fb.group({
                                                  category: [this.data.category, Validators.required]
                                                });
                                              }

         // ✅ Save changes
                                               categoryUpdate() {
                                                 if (this.categoryForm.valid) {
                                                   this.categoryService.updateCategory(this.data.categoryId, this.categoryForm.value).subscribe({
                                                     next: (response) => {
                                                        console.log('Category updated successfully:', response);
                                                        // ✅ Show success message
                                                        this.snackBar.open('Category Updated successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
                                                        this.categoryUpdated.emit(); // ✅ Notify parent to refresh grid
                                                       this.dialogRef.close(true); // Close dialog and refresh list
                                                     },
                                                     error: (error) => {
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
