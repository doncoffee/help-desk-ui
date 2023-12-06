import {Component, OnInit} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TicketService} from "../services/ticket.service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {AuthenticationService} from "../services/authentication.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {StarRatingModule} from "angular-star-rating";
import {MatCardModule} from "@angular/material/card";
import {FlexModule} from "@angular/flex-layout";
import {MyErrorStateMatcher} from "../helpers/error-state-matcher";

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatToolbarModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, StarRatingModule, MatCardModule, FlexModule, RouterLink, RouterLinkActive],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent implements OnInit {
  ticketId!: number;
  feedbackForm!: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private location: Location,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.ticketId = +params['id'];
      this.initForm();
    });
  }

  initForm(): void {
    this.feedbackForm = this.formBuilder.group({
      rate: [null, Validators.required],
      text: ['', Validators.required]
    });
  }

  leaveFeedback(): void {
    // if (this.feedbackForm.valid) {
      const feedbackData = this.feedbackForm.value;
      this.ticketService.leaveFeedback(this.ticketId, feedbackData).subscribe(
        (response) => {
          this.snackBar.open('Feedback submitted successfully!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/tickets/overview', this.ticketId]);
        },
        (error) => {
          console.error('Error submitting feedback', error);
          this.snackBar.open(error.error, 'Close', {
            duration: 5000,
          });
        }
      );
    // }
  }

  goBackToOverview() {
    this.location.back();
  }

  logout(): void {
    this.authenticationService.logout();
  }
}
