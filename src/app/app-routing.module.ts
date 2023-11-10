import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SecretComponent} from "./secret/secret.component";
import {AuthGuard} from "./helpers/auth.guard";
import {RegisterPageComponent} from "./register-page/register-page.component";
import {LoginPageComponent} from "./login-page/login-page.component";

const routes: Routes = [
  {
    path: '', component: SecretComponent, canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
