import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {TicketService} from "../services/ticket.service";
import {ReadTicket} from "../models/read-ticket.model";
import {AuthenticationService} from "../services/authentication.service";
import {AddEditTicketComponent} from "../add-edit-ticket/add-edit-ticket.component";
import { MatDialog } from '@angular/material/dialog';
import {UrgencyEnum} from "../models/urgency.enum";
import {StateEnum} from "../models/state.enum";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {
  userRole: string = '';
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
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAllTickets();
    this.getMyTickets();
    const jwtToken = localStorage.getItem('token');

    if (jwtToken) {
      this.userRole = this.authenticationService.getUserRoleFromToken(jwtToken);
    }
  }

  isValidRoleForCreateEdit(): boolean {
    // Check if the user has the 'Employee' or 'Manager' role
    return this.userRole == 'EMPLOYEE' || this.userRole == 'MANAGER';
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


  setTicketState(id: number, event: any): void {
    const selectedStatus: StateEnum = event.value;
    this.ticketService.setTicketState(id, selectedStatus).subscribe(
      () => {
        this.snackBar.open('Ticket state updated successfully', 'Close', {
          duration: 3000,
        });

        // Optionally, you can update the ticket lists after the state is changed
        this.getAllTickets();
        this.getMyTickets();
      },
      (error) => {
        console.error('Error updating ticket state:', error);
        this.snackBar.open('Error updating ticket state', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      }
    );
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


  openAddEditTicketDialog() {
    const dialogRef = this.dialog.open(AddEditTicketComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAllTickets();
          this.getMyTickets();
        }
      },
    });
  }

  openEditForm(data: any) {
    const dialogRef = this.dialog.open(AddEditTicketComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAllTickets();
          this.getMyTickets();
        }
      }
    });
  }

  goToOverview(id: number) {
    if (id !== null && id !== undefined) {
      this.router.navigate(['/tickets/overview', id]);
    }
  }

  protected readonly StateEnum = StateEnum;
}
