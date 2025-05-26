import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from './invoice.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})

export class InvoiceService {
  private apiUrl = environment.apiUrl+'/api/invoices'; // Change to your API URL

  constructor(private http: HttpClient) {}

createInvoice(invoice: any, userId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/${userId}`, invoice);
}

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  getAllInvoices(userId:number): Observable<Invoice[]> {
   return this.http.get<Invoice[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateInvoice(invoiceId: number, invoiceData: any) {
  return this.http.put(`${this.apiUrl}/${invoiceId}`, invoiceData);
  }

  deleteInvoice(invoiceId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${invoiceId}`);
}

updateInvoiceStatus(invoiceId: number, status: string): Observable<Invoice> {
  return this.http.patch<Invoice>(`${this.apiUrl}/${invoiceId}/status?status=${status}`, {});

}
}