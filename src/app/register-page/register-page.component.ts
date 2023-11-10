import { AuthenticationService } from '../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {UserRole} from "../models/user-role.enum";
import {passwordValidator} from "../helpers/password.validator";
import {MyErrorStateMatcher} from "../helpers/error-state-matcher";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent implements OnInit {
  public registerForm!: FormGroup;
  public matcher = new MyErrorStateMatcher();
  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      role: new FormControl(UserRole.EMPLOYEE, Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, passwordValidator()]),
    });
  }

  public onSubmit() {
    this.authenticationService.register(
      this.registerForm.get('firstname')!.value,
      this.registerForm.get('lastname')!.value,
      this.registerForm.get('role')!.value,
      this.registerForm.get('email')!.value,
      this.registerForm!.get('password')!.value,
    );
  }

  protected readonly UserRole = UserRole;
}
