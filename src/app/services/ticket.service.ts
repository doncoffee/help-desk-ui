import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class TicketService {

  constructor(private httpClient: HttpClient) { }

  addTicket(data: any): Observable<any> {
    return this.httpClient.post(environment.backendUrl + '/api/v1/tickets/create', data);
  }

  getTicketList(): Observable<any> {
    return this.httpClient.get(environment.backendUrl + '/api/v1/tickets');
  }

  getMyTicketList(): Observable<any> {
    return this.httpClient.get(environment.backendUrl + '/api/v1/tickets/personal');
  }
}
