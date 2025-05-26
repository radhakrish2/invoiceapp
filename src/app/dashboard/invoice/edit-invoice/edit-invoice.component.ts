import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../invoice.service';
import { ClientsService } from '../../clients/clients.service';
import { Client } from '../../clients/clients.model';
import { Invoice } from '../invoice.model';

@Component({
  selector: 'app-edit-invoice',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './edit-invoice.component.html',
  styleUrl: './edit-invoice.component.css'
})
export class EditInvoiceComponent implements OnInit {
  invoiceForm!: FormGroup;
  clients: Client[] = [];
  invoiceId!: number;

  subtotal = 0;
  tax = 0;
  totalAmount = 0;
  invoice:Invoice={
  invoiceId: 0,
  client: {
    clientId: 0,
    companyName:'',
    name: '',
    email: '',
    address: '',
    userId:1
  },
  issueDate: '',
  dueDate: '',
  items: [
    {
      description: '',
      quantity: 0,
      unitPrice: 0,
      total: 0
    }
  ],
  totalAmount: 0,
  status: 'Draft'
};

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private clientService: ClientsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
 this.invoiceId = +this.route.snapshot.paramMap.get('id')!;

  this.invoiceForm = this.fb.group({
    client: [null, Validators.required],
    issueDate: ['', Validators.required],
    dueDate: ['', Validators.required],
    items: this.fb.array([])
  });

  forkJoin({
    clients: this.clientService.getClients(),
    invoice: this.invoiceService.getInvoiceById(this.invoiceId)
  }).subscribe(({ clients, invoice }) => {
    this.clients = clients;
    this.invoice = invoice;
    this.populateForm(invoice);
  });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  populateForm(invoice: Invoice): void {
    const formatDate = (invoice.issueDate.toString()).substring(0, 10);
  const formatDueDate = (invoice.dueDate.toString()).substring(0, 10);

  const matchingClient = this.clients.find(c => c.clientId === invoice.client.clientId);

  this.invoiceForm.patchValue({
    client: matchingClient,
    issueDate: formatDate,
    dueDate: formatDueDate
  });

  // Add items
  invoice.items.forEach(item => {
    const itemGroup = this.fb.group({
      description: [item.description],
      quantity: [item.quantity, [Validators.required, Validators.min(1)]],
      unitPrice: [item.unitPrice, [Validators.required, Validators.min(0)]],
      total: [item.quantity * item.unitPrice]
    });

    itemGroup.valueChanges.subscribe(() => this.updateItemTotal(itemGroup));
    this.items.push(itemGroup);
  });

  this.calculateSummary();
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

  updateTotal(index: number): void {
    const item = this.items.at(index);
    const quantity = item.get('quantity')?.value || 0;
    const unitPrice = item.get('unitPrice')?.value || 0;
    const total = quantity * unitPrice;
    item.get('total')?.setValue(total, { emitEvent: false });
    this.calculateSummary();
  }

  onSubmit(): void {
    if (this.invoiceForm.invalid) return;

    const formValue = this.invoiceForm.value;

    const invoiceRequest = {
      clientId: formValue.client.clientId,
      issueDate: formValue.issueDate,
      dueDate: formValue.dueDate,
      items: formValue.items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };

    this.invoiceService.updateInvoice(this.invoiceId, invoiceRequest).subscribe({
      next: () => {
        alert('Invoice updated successfully!');
        this.router.navigate(['/invoices']);
      },
      error: err => {
        console.error('Failed to update invoice', err);
        alert('Failed to update invoice.');
      }
    });
  }
}
