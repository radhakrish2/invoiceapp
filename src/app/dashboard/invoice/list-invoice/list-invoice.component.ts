import { Component } from '@angular/core';
import { Invoice } from '../invoice.model';
import { InvoiceService } from '../invoice.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-invoice',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './list-invoice.component.html',
  styleUrl: './list-invoice.component.css'
})
export class ListInvoiceComponent {
invoices: Invoice[] = [];

  constructor(private invoiceService: InvoiceService, private router:Router) {}

  ngOnInit(): void {
    this.getInvoices();
  }

  getInvoices(): void {
    let userId=1 // Need to assign current user id
    this.invoiceService.getAllInvoices(userId).subscribe({
      next: (data) => {
        this.invoices = data;
      },
      error: (err) => {
        console.error('Error fetching invoices:', err);
      }
    });
  }



   onAddInvoice(): void {
    this.router.navigate(['invoices/new']);
  }

  onAddClient(): void {
     this.router.navigate(['clients']);
  }


  onEditInvoice(invoiceId: number): void {
  this.router.navigate(['invoices/edit', invoiceId]);
}

onDeleteInvoice(invoiceId: number): void {
  if (confirm('Are you sure you want to delete this invoice?')) {
    this.invoiceService.deleteInvoice(invoiceId).subscribe({
      next: () => {
        this.getInvoices(); // refresh list
      },
      error: (err) => console.error('Delete failed:', err)
    });
  }
}

onPrintInvoice(invoiceId: number): void {
   this.router.navigate(['invoices/view', invoiceId]);
}

onTogglePaid(invoice: Invoice): void {
  const updatedStatus = invoice.status === 'PAID' ? 'OVERDUE' : 'PAID';
  this.invoiceService.updateInvoiceStatus(invoice.invoiceId, updatedStatus).subscribe({
    next: () => {
      invoice.status = updatedStatus; // update UI directly
    },
    error: (err) => console.error('Status update failed:', err)
  });
}


}
