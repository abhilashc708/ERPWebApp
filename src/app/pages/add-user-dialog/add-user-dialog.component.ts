import { Component, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { UserService } from '../../services/user.service';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-add-user-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.css'
})
export class AddUserDialogComponent implements OnInit{
   userForm!: FormGroup;
    shops: any[] = []; // Store fetched shop data

  // ✅ Role options for dropdown
   availableRoles = [
     { label: 'User', value: 'ROLE_USER' },
     { label: 'Admin', value: 'ROLE_ADMIN' }
   ];

 @Output() userAdded = new EventEmitter<void>(); // ✅ Event to notify parent

  constructor(private dialogRef: MatDialogRef<AddUserDialogComponent>,
              private fb: FormBuilder,
              private http: HttpClient,
              private snackBar: MatSnackBar,
              private userService: UserService,
              private shopService: ShopService) {}

 ngOnInit() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      location: ['', Validators.required],
      address: [''],
      shopId: ['', Validators.required], // Only store Shop ID
      roles: [[], Validators.required] // Array for roles
    });
    this.fetchShops();
  }

 fetchShops() {
          this.shopService.getShops().subscribe({
              next: (data: any) => this.shops = data,  // Fix `.set()` issue
              error: (err: any) => console.error('Error fetching shops:', err)
          });
      }


 saveUser() {
    if (this.userForm.valid) {
    const formData = { ...this.userForm.value };
      // ✅ Ensure roles are always an array
      formData.roles = Array.isArray(formData.roles) ? formData.roles : [formData.roles];
      console.log('User data:', formData);

       // ✅ Save user using service
            this.userService.saveUser(formData).subscribe({
              next: (response) => {
                console.log('User saved successfully:', response);
                 // ✅ Show success message
                this.snackBar.open('User added successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
                this.userAdded.emit(); // ✅ Notify parent to refresh grid
                this.dialogRef.close(true);
              },
              error: (error) => {
                console.error('Error saving user:', error);
                this.snackBar.open('Failed to add user. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
              }
            });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
