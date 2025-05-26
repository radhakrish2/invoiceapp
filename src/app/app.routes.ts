import { Routes } from '@angular/router';
import { ClientsComponent } from './dashboard/clients/clients.component';
import { InvoiceComponent } from './dashboard/invoice/invoice.component';
import { NewInvoiceComponent } from './dashboard/invoice/new-invoice/new-invoice.component';
import { ListInvoiceComponent } from './dashboard/invoice/list-invoice/list-invoice.component';
import { EditInvoiceComponent } from './dashboard/invoice/edit-invoice/edit-invoice.component';
import { ViewInvoiceComponent } from './dashboard/invoice/view-invoice/view-invoice.component';

export const routes: Routes = [
    {
    path: 'invoices',
    component: InvoiceComponent,
    children: [
      { path: '', component: ListInvoiceComponent },
      { path: 'new', component: NewInvoiceComponent },
      { path: 'edit/:id', component: EditInvoiceComponent },
      { path: 'view/:id', component: ViewInvoiceComponent },
      // other child routes for invoices if any
    ]
  },
    {path:"clients", component:ClientsComponent},

];
