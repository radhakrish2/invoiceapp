import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators
} from '@angular/forms';

import { InvoiceService } from '../invoice.service';
import { ClientsService } from '../../clients/clients.service';
import { Client } from '../../clients/clients.model';
import { Invoice } from '../invoice.model'; // Adjust path as needed

@Component({
  selector: 'app-new-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-invoice.component.html',
  styleUrl: './new-invoice.component.css'
})
export class NewInvoiceComponent implements OnInit {
  invoiceForm!: FormGroup;
  clients: Client[] = [];

  subtotal = 0;
  tax = 0;
  totalAmount = 0;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private clientService: ClientsService
  ) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe(data => (this.clients = data));

    this.invoiceForm = this.fb.group({
      client: [null, Validators.required],
      issueDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      items: this.fb.array([])
    });

    this.addItem(); // Start with one invoice item row
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      description: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      total: [0]
    });

    itemGroup.valueChanges.subscribe(() => this.updateItemTotal(itemGroup));
    this.items.push(itemGroup);
    this.calculateSummary();
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculateSummary();
  }

  updateItemTotal(itemGroup: FormGroup): void {
    const quantity = itemGroup.get('quantity')?.value || 0;
    const unitPrice = itemGroup.get('unitPrice')?.value || 0;
    const total = quantity * unitPrice;
    itemGroup.get('total')?.setValue(total, { emitEvent: false });
    this.calculateSummary();
  }

  calculateSummary(): void {
    this.subtotal = this.items.controls.reduce(
      (sum, item) => sum + (item.get('total')?.value || 0),
      0
    );
    this.tax = this.subtotal * 0.18;
    this.totalAmount = this.subtotal + this.tax;
  }

onSubmit(): void {
  if (this.invoiceForm.invalid) return;

  const formValue = this.invoiceForm.value;

  const invoiceRequest = {
    clientId: formValue.client.clientId,  // Ensure client is a full object
    issueDate: formValue.issueDate,
    dueDate: formValue.dueDate,
    items: formValue.items.map((item: any) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }))
  };

  const userId = 1; // 🔁 Replace with actual logged-in user ID (from token/session/etc.)

  this.invoiceService.createInvoice(invoiceRequest, userId).subscribe({
    next: () => {
      alert('Invoice created successfully!');
      this.invoiceForm.reset();
      this.items.clear();
      this.addItem();
    },
    error: (err) => {
      console.error('Invoice creation failed', err);
      alert('Failed to create invoice.');
    }
  });
}

updateTotal(index: number): void {
    const item = this.items.at(index);
    const quantity = item.get('quantity')?.value || 0;
    const unitPrice = item.get('unitPrice')?.value || 0;
    const total = quantity * unitPrice;
    item.get('total')?.setValue(total, { emitEvent: false });
    this.calculateSummary();
  }

}
