import { Component, Inject, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common'; // ✅ Import this for *ngFor
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-update-user-dialog',
  imports: [ CommonModule, ReactiveFormsModule, MatSnackBarModule ],
  templateUrl: './update-user-dialog.component.html',
  styleUrl: './update-user-dialog.component.css'
})
export class UpdateUserDialogComponent implements OnInit{
 userForm!: FormGroup;  // ✅ Define userForm
shops: any[] = []; // ✅ Define 'shops' property

  @Output() userUpdated = new EventEmitter<void>(); // ✅ Event to notify parent

  constructor(
    private dialogRef: MatDialogRef<UpdateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Receive user data
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private shopService: ShopService
  ) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      name: [this.data.name, Validators.required],
      username: [this.data.username, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      phone: [this.data.phone, Validators.required],
      location: [this.data.location, Validators.required],
      address: [this.data.address],
      shopId: [this.data.shop?.shopId, Validators.required], // Ensure shopId exists
    });
  this.fetchShops(); // ✅ Call function to load shops
  }

fetchShops() {
    this.shopService.getShops().subscribe({
        next: (data: any[]) => this.shops = data,  // Fix `.set()` issue
        error: (err: any) => console.error('Error fetching shops:', err)
    });
}

  // ✅ Save changes
  saveChanges() {
    if (this.userForm.valid) {
      this.userService.updateUser(this.data.id, this.userForm.value).subscribe({
        next: (response) => {
           console.log('User updated successfully:', response);
           // ✅ Show success message
           this.snackBar.open('User Updated successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
           this.userUpdated.emit(); // ✅ Notify parent to refresh grid
          this.dialogRef.close(true); // Close dialog and refresh list
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.snackBar.open('Failed to update user. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
