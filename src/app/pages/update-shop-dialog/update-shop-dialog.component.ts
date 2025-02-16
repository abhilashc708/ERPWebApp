import { Component, Inject, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ShopService } from '../../services/shop.service';
import { CommonModule } from '@angular/common'; // ✅ Import this for *ngFor
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module

@Component({
  selector: 'app-update-shop-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './update-shop-dialog.component.html',
  styleUrl: './update-shop-dialog.component.css'
})
export class UpdateShopDialogComponent implements OnInit{
   shopForm!: FormGroup;  // ✅ Define userForm

   @Output() shopUpdated = new EventEmitter<void>(); // ✅ Event to notify parent

  constructor(private dialogRef: MatDialogRef<UpdateShopDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Receive shop data
                  private fb: FormBuilder,
                  private http: HttpClient,
                  private snackBar: MatSnackBar,
                  private shopService: ShopService) {}

                   ngOnInit() {
                                        this.shopForm = this.fb.group({
                                          name: [this.data.name, Validators.required],
                                          email: [this.data.email, [Validators.required, Validators.email]],
                                          phone: [this.data.phone, Validators.required],
                                          location: [this.data.location, Validators.required],
                                          address: [this.data.address]
                                        });
                                      }

                                    // ✅ Save changes
                                      shopUpdate() {
                                        if (this.shopForm.valid) {
                                          this.shopService.updateShop(this.data.shopId, this.shopForm.value).subscribe({
                                            next: (response) => {
                                               console.log('Shop updated successfully:', response);
                                               // ✅ Show success message
                                               this.snackBar.open('Shop Updated successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
                                               this.shopUpdated.emit(); // ✅ Notify parent to refresh grid
                                              this.dialogRef.close(true); // Close dialog and refresh list
                                            },
                                            error: (error) => {
                                              console.error('Error updating user:', error);
                                              this.snackBar.open('Failed to update shop. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
                                            }
                                          });
                                        }
                                      }

                                    closeDialog() {
                                        this.dialogRef.close();
                                      }

}
