import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import {CategoryEnum} from "../models/category.enum";
import {UrgencyEnum} from "../models/urgency.enum";
import {StateEnum} from "../models/state.enum";

@Injectable({
  providedIn: 'root',
})
export class TicketService {

  constructor(private httpClient: HttpClient) { }

  addTicket(data: any): Observable<any> {
    return this.httpClient.post(environment.backendUrl + '/api/v1/tickets/create', data);
  }

  updateTicket(id: number, data: any): Observable<any> {
    return this.httpClient.put(environment.backendUrl + '/api/v1/tickets/' + id, data);
  }

  getTicketList(): Observable<any> {
    return this.httpClient.get(environment.backendUrl + '/api/v1/tickets');
  }

  getMyTicketList(): Observable<any> {
    return this.httpClient.get(environment.backendUrl + '/api/v1/tickets/personal');
  }

  setTicketState(id: number, state: StateEnum): Observable<any> {
    return this.httpClient.put(environment.backendUrl + '/api/v1/tickets/state/' + id, state);
  }

  findById(id: number): Observable<any> {
    return this.httpClient.get(environment.backendUrl + '/api/v1/tickets/overview/' + id);
  }

  getTicketComments(id: number): Observable<any> {
    return this.httpClient.get(environment.backendUrl + '/api/v1/tickets/overview/' + id + '/comments');
  }

  getTicketHistory(id: number): Observable<any> {
    return this.httpClient.get(environment.backendUrl + '/api/v1/tickets/overview/history/' + id);
  }

  downloadFile(id: number): Observable<any> {
    return this.httpClient.get(environment.backendUrl + '/api/v1/tickets/overview/' + id + '/download');
  }

  createComment(id: number, data: string): Observable<any> {
    return this.httpClient.post(environment.backendUrl + '/api/v1/tickets/overview/' + id + '/create_comment', data);
  }

  leaveFeedback(id: number, data: string): Observable<any> {
    return this.httpClient.post(environment.backendUrl + '/api/v1/tickets/overview/' + id + '/leave_feedback', data);
  }
}
