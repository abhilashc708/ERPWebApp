import { Component, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgIf, CommonModule } from '@angular/common';
import { FormArray, FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Module
import { ShopService, Shop } from '../../services/shop.service';
import { CategoryService, Category } from '../../services/category.service';
import { ItemService, Item } from '../../services/item.service';
import { BillService, Bill } from '../../services/bill.service';

@Component({
  selector: 'app-generate-bill',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule],
  templateUrl: './generate-bill.component.html',
  styleUrl: './generate-bill.component.css'
})
export class GenerateBillComponent implements OnInit{
   shops: any[] = []; // Store fetched shop data
      category: any[] = [];
      items: any[] = [];
       bill: any = null;
billingForm!: FormGroup;
  totalAmount = 0;
filteredItems: { [key: number]: any[] } = {}; // Store filtered items by index

 paymentMethods = ['Cash', 'UPI','Credit Card', 'Debit Card', 'Net Banking'];

  @Output() billAdded = new EventEmitter<void>(); // ✅ Event to notify parent

     constructor( private dialogRef: MatDialogRef<GenerateBillComponent>,
       private fb: FormBuilder,
                  private http: HttpClient,
                  private snackBar: MatSnackBar,
                  private shopService: ShopService,
                  private categoryService: CategoryService,
                  private itemService: ItemService,
                  private billService: BillService) {}

  ngOnInit() {
    this.billingForm = this.fb.group({
      billCode: [this.generateBillCode()], // Set the bill code when form loads
      phone: ['', Validators.required],
      billingDate: [this.getTodayDate(), Validators.required],
      paymentMethod: [''] ,
        shopId: ['', Validators.required],
      items: this.fb.array([])
    });
  this.fetchCategory();
   this.fetchShops();
   this.fetchItems();
    this.addProduct(); // Add an initial item
  }

  get productsFormArray() {
    return this.billingForm.get('items') as FormArray;
  }

addProduct() {
  const productForm = this.fb.group({
    categoryId: ['', Validators.required],
    itemId: ['', Validators.required],
    quantity: ['', Validators.required],
    price: ['', Validators.required]
  });

 this.productsFormArray.push(productForm);
}


  removeProduct(index: number) {
    this.productsFormArray.removeAt(index);
    this.updateTotal();
  }

  updateTotal(index?: number) {
    this.totalAmount = this.productsFormArray.controls.reduce((sum, product) => {
      const quantity = product.get('quantity')?.value || 0;
      const price = product.get('price')?.value || 0;
      return sum + (quantity * price);
    }, 0);
  }

  getTotal(index: number): number {
    const productsFormArray = this.productsFormArray.at(index);
    return (productsFormArray.get('quantity')?.value || 0) * (productsFormArray.get('price')?.value || 0);
  }

 submitBill() {
            if (this.billingForm.valid) {
              debugger;
            const formData = { ...this.billingForm.value };
              console.log('Item data:', formData);
               // ✅ Save item using service
                    this.billService.saveBill(formData).subscribe({
                      next: (response) => {
                        console.log('Bill saved successfully:', response);
                        this.bill = response; // Store the bill details
                         // ✅ Show success message
                        this.snackBar.open('Bill added successfully!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
                        this.billAdded.emit(); // ✅ Notify parent to refresh grid

                    // ✅ Automatically print the bill
                       setTimeout(() => this.printBill(), 500);

                     // ✅ Close the dialog after printing
                     setTimeout(() => this.dialogRef.close(true), 1000);
                      },
                      error: (error) => {
                        console.error('Error saving bill:', error);
                        this.snackBar.open('Failed to add bill. Please try again.', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
                      }
                    });
            }
          }

fetchCategory() {
              this.categoryService.getCategory().subscribe({
                  next: (data: any) => this.category = data,  // Fix `.set()` issue
                  error: (err: any) => console.error('Error fetching category:', err)
              });
          }
         fetchShops() {
                  this.shopService.getShops().subscribe({
                      next: (data: any) => this.shops = data,  // Fix `.set()` issue
                      error: (err: any) => console.error('Error fetching shops:', err)
                  });
              }
            fetchItems() {
              this.itemService.getItems().subscribe({
                next: (data: any) => {
                  console.log('Fetched Items:', data); // ✅ Debug API response
                  this.items = data;
                },
                error: (err: any) => console.error('Error fetching item:', err)
              });
            }

onCategoryChange(index: number) {
  const categoryId = this.productsFormArray.at(index).get('categoryId')?.value;
  console.log('Selected Category ID:', categoryId);

  if (!categoryId) {
    console.log('No category selected, clearing items');
    this.filteredItems[index] = [];
    return;
  }
  // Reset the 'itemId' field when category changes
  this.productsFormArray.at(index).patchValue({ itemId: null, quantity: null, price: null });

  this.filteredItems[index] = this.items.filter((item) =>
    Number(item.category?.categoryId) === Number(categoryId)
  );
  console.log('Filtered Items:', this.filteredItems[index]);
}

onQuantityChange(index: number) {

  const selectedItemId = this.productsFormArray.at(index).get('itemId')?.value;

  const enteredQuantity = this.productsFormArray.at(index).get('quantity')?.value;

  if (!selectedItemId) return; // No item selected yet

  // Find the selected item
  const selectedItem = this.items.find(item => item.productId === Number(selectedItemId));

  if (selectedItem) {
    const availableStock = selectedItem.quantity;
    console.log(`Available Stock: ${availableStock}, Entered: ${enteredQuantity}`);

    if (enteredQuantity > availableStock) {
      alert(`⚠️ Only ${availableStock} items available in stock!`);

      // Reset quantity to max available
      this.productsFormArray.at(index).patchValue({ quantity: availableStock });
    }
  }
}

onItemChange(index: number) {
  // Reset quantity when item changes
  this.productsFormArray.at(index).patchValue({ quantity: null, price: null });
}

getItemsControls() {
  return (this.billingForm.get('items') as FormArray).controls;
}

generateBillCode(): string {
  const prefix = 'TJ'; // Fixed prefix
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
  return `${prefix} ${randomNumber}`;
}
 // Function to return today's date in "YYYY-MM-DD" format
  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
  }

closeDialog() {
  this.dialogRef.close(); // Closes all open dialogs
}

printBill() {
  const invoiceHtml = `
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center;
                 height: 100vh; background: #f8f8f8; }
        .invoice-container {  width: max-content;  max-width: 80mm; padding: 5px; border: 1px dashed #000;
                               background: #fff; font-family: 'Courier New', monospace; font-size: 12px;
                               text-align: left; display: block; margin: 0 auto;  }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: fixed;  }
        th, td { border-bottom: 1px dashed #000; padding: 3px; text-align: left; word-wrap: break-word;
                   font-size: 11px; }
        h2, h3 { margin: 5px 0; }
         .product-name { max-width: 80px; white-space: nowrap; overflow: hidden;text-overflow: ellipsis; }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <h2>Demo Invoice</h2>
        <p><strong>Bill Code:</strong> ${this.bill?.billCode}</p>
        <p><strong>Date:</strong> ${new Date(this.bill?.billingDate).toLocaleDateString()}</p>
        <p><strong>Shop:</strong> ${this.bill?.shop?.name}</p>
        <p><strong>Customer:</strong> ${this.bill?.phone}</p>
        <hr />
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
           ${this.bill?.items.map((item: any) => `
              <tr>
                <td class="product-name">${item.product.productName}</td>
                <td>${item.quantity}</td>
                <td>₹ ${item.price}</td>
                <td>₹ ${item.quantity * item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <hr />
        <h3>Total: ₹ ${this.getTotalAmount()}</h3>
        <p>Thank You! 😊</p>
      </div>
    </body>
    </html>
  `;

  // Open a new print window and print the invoice
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }

  // ✅ Ensure the invoice does NOT stay on the page
  this.bill = null;
}

getTotalAmount() {
    return this.bill.items.reduce((total: number, item: any) => total + (item.quantity * item.price), 0);
  }
}
