import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { Chart } from 'chart.js/auto';
import { ReportService } from '../../services/report.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


interface SaleTransaction {
  billingDate: string;
  billCode: string;
  branch: string;
  paymentMethod: string;
    shop: {
      shopId: number;
      name: string;
      phone: string;
      location: string;
      address: string;
      email: string;
    };
  items: BillItem[];  // ✅ Ensure this is defined
}

export interface BillItem {
  id: number;
  product: {
    productId: number;
    productName: string;
  };
  quantity: number;
  price: number;
}
interface ExpenseTransaction {
  createdAt: string;
  expenseBillCode: string;
  branch: string;
  paymentMethod: string;
  rate: number;
   shop: {
        shopId: number;
        name: string;
        phone: string;
        location: string;
        address: string;
        email: string;
      };
}


@Component({
  selector: 'app-reports',
imports: [RouterModule, CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit{

    startDate: string = '';
    endDate: string = '';
    reportData: any[] = [];
    displayedRecords: any[] = []; // ✅ Stores visible records
    totalSales: number = 0;
    totalExpenses: number = 0;
    totalProfit: number = 0;
    recordsPerPage = 5; // ✅ Show 5 records at a time
    currentPage = 1;

constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.fetchReports();
    window.addEventListener("scroll", this.onScroll.bind(this)); // ✅ Detect scroll event
  }

fetchReports() {
  debugger;
  this.reportService.getReports(this.startDate, this.endDate).subscribe((data: any) => {
    console.log('API Response:', data);  // 👀 Check structure in console

    // Ensure 'data' is in the correct format
    if (data && data.totalSales !== undefined && data.totalExpenses !== undefined) {
      this.totalSales = data.totalSales;
      this.totalExpenses = data.totalExpenses;
      this.totalProfit = this.totalSales - this.totalExpenses;

 // ✅ Map sales transactions & sum total amount from bill items
      const salesData = (data.salesTransactions || []).map((sale: any) => {
        debugger;
        const totalAmount = sale.items?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0;
        return {
          billingDate: sale.billingDate,
          billCode: sale.billCode,
          branch: sale.shop?.name || 'Unknown Branch',
          paymentMethod: sale.paymentMethod,
          totalAmount: totalAmount, // ✅ Store total bill amount
          type: 'Sales'
        };
      });

  // Map expense transactions
  const expenseData = (data.expenseTransactions || []).map((expense: ExpenseTransaction) => ({
 billingDate: expense.createdAt, // Adjust based on available fields
 billCode: expense.expenseBillCode,
    branch: expense.shop.name,
    paymentMethod: expense.paymentMethod,
    totalAmount: expense.rate || 0,
    type: 'Expense'
  }));

  // Merge both arrays
  this.reportData = [...salesData, ...expenseData];
   this.displayedRecords = this.reportData.slice(0, this.recordsPerPage); // ✅ Show first 5 records
    } else {
      console.error("Unexpected API response format", data);
    }

    this.loadSalesExpenseChart();
    this.loadCategoryChart();
  });
}

  // ✅ Load more records when scrolling down
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.loadMoreRecords();
    }
  }

  // ✅ Load more records
  loadMoreRecords() {
    const nextRecords = this.reportData.slice(
      this.currentPage * this.recordsPerPage,
      (this.currentPage + 1) * this.recordsPerPage
    );

    if (nextRecords.length > 0) {
      this.displayedRecords = [...this.displayedRecords, ...nextRecords]; // ✅ Append new records
      this.currentPage++;
    }
  }

 loadSalesExpenseChart() {
  const canvas = document.getElementById("salesExpenseChart") as HTMLCanvasElement;
     if (canvas) {
         const ctx = canvas.getContext("2d");
         if (ctx) {
             new Chart(ctx, {
                 type: "bar",
                 data: {
                     labels: ["Sales", "Expenses"],
                     datasets: [{
                         label: "Amount in ₹",
                         data: [this.totalSales, this.totalExpenses],
                         backgroundColor: ["#28a745", "#dc3545"]
                     }]
                 },
                 options: { responsive: true }
             });
         } else {
             console.error("Failed to get 2D context for salesExpenseChart");
         }
     } else {
         console.error("salesExpenseChart canvas not found");
     }
    }

loadCategoryChart() {
  const canvas = document.getElementById("categoryChart") as HTMLCanvasElement;
  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Total Sales", "Total Expense", "Net Profit"],
          datasets: [{
            data: [this.totalSales, this.totalExpenses, this.totalProfit],
            backgroundColor: ["#28a745", "#dc3545", "#007bff"]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allows resizing
          plugins: {
            legend: {
              position: 'bottom', // Moves legend to the bottom
              labels: { font: { size: 12 } } // Adjust legend font size
            }
          }
        }
      });
    } else {
      console.error("Failed to get 2D context for categoryChart");
    }
  } else {
    console.error("categoryChart canvas not found");
  }
}

  exportPDF() {
    const doc = new jsPDF();
    doc.setFont("Arial"); // ✅ Set a font that supports ₹ symbol
    doc.text('Business Report', 20, 10);

    (doc as any).autoTable({
      head: [['Date', 'Bill Code', 'Branch', 'Total Amount', 'Payment Method', 'Type']],
      body: this.reportData.map(r => [
        this.formatDate(r.billingDate),  // ✅ Format Date to "DD-MM-YYYY"
        r.billCode || 'N/A',
        r.branch || 'N/A',
        `₹ ${r.totalAmount || 0}`,
        r.paymentMethod || 'N/A',
        r.type || 'N/A'
      ]),
    });

    doc.save('report.pdf');
  }

  exportCSV() {
    let csvContent = 'Date,Bill Code,Branch,Total Amount,Payment Method,Type\n';

    this.reportData.forEach(r => {
      const formattedDate = this.formatCsvDate(r.billingDate); // ✅ Format the date
      const amount = `\u20B9 ${r.totalAmount || 0}`; // ✅ Ensure ₹ symbol
      const billCode = r.billCode || 'N/A';
      const branch = r.branch || 'N/A';
      const paymentMethod = r.paymentMethod || 'N/A';
      const type = r.type || 'N/A';

      csvContent += `${formattedDate},${billCode},${branch},${amount},${paymentMethod},${type}\n`;
    });

    // ✅ Convert CSV string to a Blob & download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${new Date().toISOString().slice(0, 10)}.csv`; // ✅ Dynamic filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

formatDate(dateString: string): string {
  if (!dateString) return 'N/A';  // ✅ Handle missing dates
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB');  // ✅ Formats as "DD/MM/YYYY"
}

formatCsvDate(dateString: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
}

toggleSidebar() {
   const sidebar = document.getElementById('sidebar');
   sidebar?.classList.toggle('open');
   }
}
