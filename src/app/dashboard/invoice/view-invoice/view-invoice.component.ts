import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../invoice.service';
import { ClientsService } from '../../clients/clients.service';
import { Invoice } from '../invoice.model';
import { Client } from '../../clients/clients.model';

@Component({
  selector: 'app-view-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-invoice.component.html',
  styleUrl: './view-invoice.component.css'
})
export class ViewInvoiceComponent implements OnInit {
  invoiceId!: number;
  invoice!: Invoice;
  subtotal = 0;
  tax = 0;
  totalAmount = 0;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private clientService: ClientsService
  ) {}

  ngOnInit(): void {
    this.invoiceId = +this.route.snapshot.paramMap.get('id')!;
    this.loadInvoice();
  }

  loadInvoice(): void {
    this.invoiceService.getInvoiceById(this.invoiceId).subscribe(invoice => {
      this.invoice = invoice;
      this.calculateSummary();
    });
  }

 calculateSummary(): void {
  this.subtotal = 0;

  this.invoice.items.forEach(item => {
    item.total = item.quantity * item.unitPrice; // Add this if not already calculated
    this.subtotal += item.total;
  });

  this.tax = this.subtotal * 0.18;
  this.totalAmount = this.subtotal + this.tax;
}

  printInvoice(): void {
    const printContents = document.getElementById('print-section')?.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents || '';
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }
}
