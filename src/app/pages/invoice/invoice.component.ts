import { Component, Inject } from '@angular/core';  // ✅ Import Inject
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';  // ✅ Import MAT_DIALOG_DATA
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice',
  imports: [MatDialogModule, CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {

 bill: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { bill: any }) {
     this.bill = data.bill;  // ✅ Correctly extract the bill from dialog data
   }

  print() {
    window.print();
  }

  downloadPDF() {
    const invoiceElement = document.getElementById('invoice');
    html2canvas(invoiceElement!).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`invoice_${this.bill.billCode}.pdf`);
    });
  }

  getTotalAmount() {
    return this.bill.items.reduce((total: number, item: any) => total + (item.quantity * item.price), 0);
  }
}
