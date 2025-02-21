import { Component, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-add-category-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './add-category-dialog.component.html',
  styleUrl: './add-category-dialog.component.css'
})
export class AddCategoryDialogComponent implements OnInit{

    categoryForm!: FormGroup;
      @Output() catAdded = new EventEmitter<void>(); // ✅ Event to notify parent

      constructor(private dialogRef: MatDialogRef<AddCategoryDialogComponent>,
                        private fb: FormBuilder,
                        private http: HttpClient,
                        private snackBar: MatSnackBar,
                        private categoryService: CategoryService) {}

         ngOnInit() {
           this.categoryForm = this.fb.group({
             category: ['', Validators.required]
                    });
                  }

          saveCategory() {
            if (this.categoryForm.valid) {
              const formData = { ...this.categoryForm.value };
              console.log('Category data:', formData);

              // ✅ Save category using service
              this.categoryService.saveCategory(formData).subscribe({
              next: (response) => {
                console.log('Category saved successfully:', response);
                // ✅ Show success message
                this.snackBar.open('Category added successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
                this.catAdded.emit(); // ✅ Notify parent to refresh grid
                this.dialogRef.close(true);
                },
              error: (error) => {
                console.error('Error saving user:', error);
                this.snackBar.open('Failed to add category. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
                }
              });
            }
          }

 closeDialog() {
     this.dialogRef.close();
   }

}
