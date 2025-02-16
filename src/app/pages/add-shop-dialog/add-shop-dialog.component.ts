import { Component, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-add-shop-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './add-shop-dialog.component.html',
  styleUrl: './add-shop-dialog.component.css'
})
export class AddShopDialogComponent implements OnInit{
   shopForm!: FormGroup;
    @Output() shopAdded = new EventEmitter<void>(); // ✅ Event to notify parent

     constructor(private dialogRef: MatDialogRef<AddShopDialogComponent>,
                  private fb: FormBuilder,
                  private http: HttpClient,
                  private snackBar: MatSnackBar,
                  private shopService: ShopService) {}

                   ngOnInit() {
                      this.shopForm = this.fb.group({
                        name: ['', Validators.required],
                        email: ['', [Validators.required, Validators.email]],
                        phone: ['', Validators.required],
                        location: ['', Validators.required],
                        address: ['']
                      });
                    }

                  saveShop() {
                      if (this.shopForm.valid) {
                      const formData = { ...this.shopForm.value };
                        console.log('Shop data:', formData);

                         // ✅ Save user using service
                              this.shopService.saveShop(formData).subscribe({
                                next: (response) => {
                                  console.log('Shop saved successfully:', response);
                                   // ✅ Show success message
                                  this.snackBar.open('Shop added successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
                                  this.shopAdded.emit(); // ✅ Notify parent to refresh grid
                                  this.dialogRef.close(true);
                                },
                                error: (error) => {
                                  console.error('Error saving user:', error);
                                  this.snackBar.open('Failed to add shop. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
                                }
                              });
                      }
                    }
closeDialog() {
    this.dialogRef.close();
  }

}
