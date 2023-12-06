import {Component, OnInit} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {AuthenticationService} from "../services/authentication.service";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatLineModule, MatOptionModule} from "@angular/material/core";
import {ActivatedRoute, Router} from "@angular/router";
import {TicketService} from "../services/ticket.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import {MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatTabsModule} from "@angular/material/tabs";
import {HistoryModel} from "../models/history.model";
import {CommentModel} from "../models/comment.model";
import {saveAs} from 'file-saver';
import {AttachmentModel} from "../models/attachment.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatToolbarModule, MatCardModule, MatListModule, MatLineModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatPaginatorModule, MatSelectModule, MatSortModule, MatTableModule, MatTabsModule, ReactiveFormsModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  ticketId!: number;
  ticketData: any;
  comments: any;
  history: any;
  commentForm: FormGroup;
  displayedHistoryColumns: string[] = [
    'date',
    'user',
    'action',
    'description',
  ];
  displayedCommentsColumns: string[] = [
    'date',
    'user',
    'text',
  ];

  historyDataSource!: MatTableDataSource<HistoryModel>;
  commentsDataSource!: MatTableDataSource<CommentModel>;

  constructor(private route: ActivatedRoute,
              private ticketService: TicketService,
              private authenticationService: AuthenticationService,
              private location: Location,
              private snackBar: MatSnackBar,
              private formBuilder: FormBuilder,
              private router: Router,
  ) {
    this.commentForm = this.formBuilder.group({
      text: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ticketId = +params['id'];
      this.loadTicketData();
      this.getTicketHistory();
      this.getTicketComments();
    });
  }

  getTicketHistory(): void {
    this.ticketService.getTicketHistory(this.ticketId).subscribe(
      (data) => {
      this.historyDataSource = new MatTableDataSource(data);
    });
  }

  getTicketComments(): void {
    this.ticketService.getTicketComments(this.ticketId).subscribe(
      (data) => {
        this.commentsDataSource = new MatTableDataSource(data);
      });
  }

  loadTicketData(): void {
    this.ticketService.findById(this.ticketId).subscribe(
      (data) => {
        this.ticketData = data;
      },
      (error) => {
        console.error('Error fetching ticket data', error);
      }
    );
    this.ticketService.getTicketComments(this.ticketId).subscribe(
      (data) => {
        this.comments = data;
      },
      (error) => {
        console.error('Error fetching ticket comments', error);
      }
    );
    this.ticketService.getTicketHistory(this.ticketId).subscribe(
      (data) => {
        this.history = data;
      },
      (error) => {
        console.error('Error fetching ticket history', error);
      }
    );
  }

  downloadAttachedFile() {
    this.ticketService.downloadFile(this.ticketId).subscribe(
      (attachmentDto: AttachmentModel) => {
        const decodedBlob = this.base64ToUint8Array(attachmentDto.blob);

        // Create a Blob from the decoded Uint8Array
        const blob = new Blob([decodedBlob], { type: 'application/octet-stream' });
        saveAs(blob, attachmentDto.name);
      },
      error => {
        console.error('Error downloading file', error);
        this.snackBar.open('There is no attachment for this ticket.', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const length = binaryString.length;
    const uint8Array = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    return uint8Array;
  }

  submitComment(): void {
    if (this.commentForm.valid) {
      const commentText = this.commentForm.get('text')!.value;
      this.ticketService.createComment(this.ticketId, commentText).subscribe(
        (response) => {
          this.getTicketComments();
          this.commentForm.reset();
          this.snackBar.open('Comment has been added!', 'Close', {duration: 3000})
        },
        (error) => {
          console.error('Error creating comment', error);
          this.snackBar.open('Error creating comment, try later', 'Close', {duration: 3000})
        }
      );
    }
  }

  goBackToTicketList() {
    this.router.navigate(['tickets']);
  }

  goToFeedback() {
    if (this.ticketId !== null && this.ticketId !== undefined) {
      this.router.navigate([`/tickets/overview/${this.ticketId}/leave_feedback`]);
    }
  }

  logout(): void {
    this.authenticationService.logout();
  }
}
