import { Client } from "../clients/clients.model";

export interface Invoice {
  invoiceId:number
  client: Client;  // You can replace 'any' with your Client type
  issueDate: string;
  dueDate: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  totalAmount: number;
  status: string;
}

