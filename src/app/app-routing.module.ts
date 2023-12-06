import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./helpers/auth.guard";
import {RegisterPageComponent} from "./register-page/register-page.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {TicketsComponent} from "./tickets/tickets.component";
import {OverviewComponent} from "./overview/overview.component";
import {FeedbackComponent} from "./feedback/feedback.component";

const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: 'tickets',
    component: TicketsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tickets/overview/:id',
    component: OverviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tickets/overview/:id/leave_feedback',
    component: FeedbackComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
