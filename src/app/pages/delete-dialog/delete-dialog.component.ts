import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-delete-dialog',
  imports: [MatDialogModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent {

   constructor(
      public dialogRef: MatDialogRef<DeleteDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { name: string }
    ) {}

    confirmDelete(): void {
      this.dialogRef.close(true); // Return true when "Confirm" is clicked
    }

   closeDialog() {
       this.dialogRef.close(false);
     }

}
