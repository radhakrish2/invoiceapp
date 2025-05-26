import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from './clients.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

    private baseUrl = environment.apiUrl+'/api/clients'; // Adjust as per your backend

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, client);
  }


   updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(this.baseUrl+"/"+client.clientId, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
