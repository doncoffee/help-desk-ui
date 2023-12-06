import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatRadioModule} from "@angular/material/radio";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  MAT_DIALOG_DATA, MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {TicketService} from "../services/ticket.service";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {CategoryEnum} from "../models/category.enum";
import {UrgencyEnum} from "../models/urgency.enum";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MyErrorStateMatcher} from "../helpers/error-state-matcher";

@Component({
  selector: 'app-add-edit-ticket',
  standalone: true,
  imports: [CommonModule, MatRadioModule, MatDatepickerModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatDialogClose, MatDialogTitle, MatDialogContent, MatInputModule, MatDialogActions, MatButtonModule, MatToolbarModule, FormsModule],
  templateUrl: './add-edit-ticket.component.html',
  styleUrl: './add-edit-ticket.component.css'
})
export class AddEditTicketComponent implements OnInit {
  ticketForm: FormGroup;
  fileName = 'Select File';
  selectedFile: any;
  public matcher = new MyErrorStateMatcher();

  @ViewChild('UploadFileInput') uploadFileInput!: ElementRef;

  constructor(
    private ticketService: TicketService,
    private dialogRef: MatDialogRef<AddEditTicketComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.ticketForm = this.formBuilder.group({
      category: [CategoryEnum.APPLICATION_AND_SERVICES, Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      urgency: [UrgencyEnum.AVERAGE, Validators.required],
      desiredResolutionDate: [null, Validators.required],
      attachment: [null],
      comment: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.ticketForm.patchValue(this.data);
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      const formData = new FormData();

      formData.append('attachment', this.selectedFile);

      const jsonPayload = {
        category: this.ticketForm.get('category')?.value,
        name: this.ticketForm.get('name')?.value,
        description: this.ticketForm.get('description')?.value,
        urgency: this.ticketForm.get('urgency')?.value,
        desiredResolutionDate: this.ticketForm.get('desiredResolutionDate')?.value,
        comment: this.ticketForm.get('comment')?.value,
      };
      // Convert the JSON object to a string and append it as a blob
      const jsonBlob = new Blob([JSON.stringify(jsonPayload)], { type: 'application/json' });
      formData.append('ticket', jsonBlob);

      if (this.data) {
        // If it's an update, append the ID to the FormData
        this.ticketService.updateTicket(this.data.id, formData).subscribe({
          next: (val: any) => {
            this.snackBar.open('Ticket details updated!', 'Close', {duration: 5000});
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
            this.snackBar.open(err.error, 'Close', {duration: 5000});
          },
        });
      } else {
        // It's a new ticket, so addTicket logic remains the same
        this.ticketService.addTicket(formData).subscribe({
          next: (val: any) => {
            this.snackBar.open('Ticket added successfully!', 'Close', {duration: 5000});
            this.ticketForm.reset();
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
            this.snackBar.open(err.error, 'Close', {duration: 5000});
          },
        });
      }
    }
  }

  myFilter = (selectedDate: Date | null): boolean => {
    if (!selectedDate) {
      return false;
    }
    const currentDate = new Date();

    return selectedDate >= currentDate;
  };

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.fileName = '';
      const file: File = fileInput.target.files[0];
      this.selectedFile = file;
      this.fileName = file.name;
    } else {
      this.fileName = 'Select File';
    }
  }

  protected readonly CategoryEnum = CategoryEnum;
  protected readonly UrgencyEnum = UrgencyEnum;
}
