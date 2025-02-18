import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { NgFor } from '@angular/common';
import { UpdateUserDialogComponent } from '../update-user-dialog/update-user-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module

@Component({
  selector: 'app-users',
  imports: [RouterModule, CommonModule, FormsModule, NgFor, MatSnackBarModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
    currentPage: number = 1;
    usersPerPage: number = 5;

users = signal<User[]>([]); // Angular 19 Signal

    constructor(private userService: UserService,
                private dialog: MatDialog,
                 private snackBar: MatSnackBar) {}

    ngOnInit() {
        this.fetchUsers();
    }

    fetchUsers() {
        this.userService.getUsers().subscribe({
            next: (data) => this.users.set(data),
            error: (err) => console.error('Error fetching users:', err)
        });
    }

  totalPages() {
          return Math.ceil(this.users.length / this.usersPerPage);
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

      openAddUserDialog() {
        const dialogRef = this.dialog.open(AddUserDialogComponent, {
          width: '400px'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log("User added:", result);
             this.fetchUsers();
          }
        });
      }

    // ✅ Open edit popup
      openEditDialog(user: any) {
        const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
          width: '400px',
          data: user // Pass user data to dialog
        });

        // Refresh user list after update
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
             console.log("User Updated:", result);
            this.fetchUsers();
          }
        });
      }

    // ✅ Delete popup
    openDeleteDialog(user: any, event: MouseEvent): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
          width: '400px',
          data: { name: user.name },
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
          if (confirmed) {
            this.deleteUser(user.id);
          }
        });
      }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        console.log('Delete Response:', response);
          this.snackBar.open('User Deleted successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
        this.fetchUsers(); // Refresh user list after deletion
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.snackBar.open('Failed to delete user. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
      }
    });
  }

toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('open');
}
}
