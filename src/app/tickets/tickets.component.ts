import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {TicketService} from "../services/ticket.service";
import {ReadTicket} from "../models/read-ticket.model";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {

  // form : boolean = false;
  // readTicket!: ReadTicket;
  displayedColumns: string[] = [
    'id',
    'name',
    'desiredResolutionDate',
    'urgency',
    'state',
    'action',
  ];
  // Ticket list will be assigned to this, and it is passed as the data source to the mat-table in the HTML template
  dataSource!: MatTableDataSource<ReadTicket>;
  myTicketsDataSource!: MatTableDataSource<ReadTicket>;

  @ViewChild(MatPaginator) allPaginator!: MatPaginator;
  @ViewChild('myTicketsPaginator') myTicketsPaginator!: MatPaginator;
  @ViewChild(MatSort) allSort!: MatSort;
  @ViewChild('myTicketsSort') myTicketsSort!: MatSort;

  constructor(
    private ticketService: TicketService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.getAllTickets();
    this.getMyTickets();
  }

  getAllTickets(): void {
    this.ticketService.getTicketList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.allSort;
      this.dataSource.paginator = this.allPaginator;
    });
  }

  getMyTickets(): void {
    this.ticketService.getMyTicketList().subscribe((data) => {
      this.myTicketsDataSource = new MatTableDataSource(data);
      this.myTicketsDataSource.sort = this.myTicketsSort;
      this.myTicketsDataSource.paginator = this.myTicketsPaginator;
    });
  }

  applyAllTicketFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyMyTicketFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.myTicketsDataSource.filter = filterValue.trim().toLowerCase();
    if (this.myTicketsDataSource.paginator) {
      this.myTicketsDataSource.paginator.firstPage();
    }
  }

  logout(): void {
    this.authenticationService.logout();
  }


  // addProduct(t: any){
  //   this.ticketService.addTicket(t).subscribe(() => {
  //     this.getAllTickets();
  //     this.form = false;
  //   });
  // }
}
