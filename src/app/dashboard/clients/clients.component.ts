import { Component, OnInit } from '@angular/core';
import { Client } from './clients.model';
import { ClientsService } from './clients.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var $: any;



@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];

  tempClient:Client = {name:'',email:'',companyName:'',address:'',userId:1};

  newClient: Client = {
    name: '',
    email: '',
    companyName: '',
    address: '',
    userId: 1 // Change as needed
  };

  constructor(private clientService: ClientsService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe(data => {
      this.clients = data;
    });
  }

  saveClient() {
    this.clientService.createClient(this.newClient).subscribe({
      next: client => {
        this.clients.push(client);
        this.newClient = {
          name: '',
          email: '',
          companyName: '',
          address: '',
          userId: 1
        };
      }
    });


       // Close the modal programmatically
      $(".modal").modal("hide");


  }


  editClient(c:Client)
  {
       this.tempClient={...c};
  }


  updateClient()
  {
    this.clientService.updateClient(this.tempClient).subscribe(response=>{
      this.loadClients();
      $(".modal").modal("hide");
    })
  }

  deleteClient(id: number) {
    this.clientService.deleteClient(id).subscribe(() => {
      this.clients = this.clients.filter(c => c.clientId !== id);
    });
  }
}