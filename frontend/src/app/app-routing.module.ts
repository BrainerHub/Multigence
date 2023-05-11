import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin/admin.component';
import { LayoutHeaderComponent } from './components/layout/layout-header/layout-header.component';
import { ChangePasswordComponent } from './components/login/change-password/change-password.component';
import { ForgetPasswordComponent } from './components/login/forget-password/forget-password.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/login/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AccountComponent } from './components/account/account.component';
import { ContentComponent } from './components/content/content.component';
import { DataLoadComponent } from './components/data-load/data-load.component';
import { TestComponent } from './components/test/test.component';
import { ProgressComponent } from './components/progress/progress.component';
import { InvitationsComponent } from './components/invitations/invitations.component';
import { AcceptComponent } from './components/invitations/accept/accept.component';
import { QuestionaryComponent } from './components/questionary/questionary.component';
import { CorridorReportComponent } from './components/report/corridor-report/corridor-report.component';
import { QuestionaryReportComponent } from './components/report/questionary-report/questionary-report.component';
import { CorridorLegendItemComponent } from './components/report/corridor-legend-item/corridor-legend-item.component';

const routes: Routes = [
{path: '', redirectTo: 'admin', pathMatch: 'full'},
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'reset-password', component: ForgetPasswordComponent},
  {path: 'reset-password/change', component: ChangePasswordComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  {path: 'users', component: AdminUsersComponent,canActivate: [AuthGuard]},
  {path: 'account', component: AccountComponent,canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent,canActivate: [AuthGuard]},
  {path: 'content', component: ContentComponent,canActivate: [AuthGuard]},
  {path: 'import', component: DataLoadComponent,canActivate: [AuthGuard]},
  {path: 'test', component: TestComponent,canActivate: [AuthGuard]},
  {path: 'progress', component: ProgressComponent,canActivate: [AuthGuard]},
  {path: 'invitations', component: InvitationsComponent,canActivate: [AuthGuard]},
  {path: 'accept', component: AcceptComponent,canActivate: [AuthGuard]},
  {path: 'questionary', component: QuestionaryComponent,canActivate: [AuthGuard]},
  {path: 'report', component: CorridorReportComponent, canActivate: [AuthGuard]},
  {path: 'layo', component: CorridorLegendItemComponent,canActivate: [AuthGuard]},
  {path: 'questionary/report', component: QuestionaryReportComponent, canActivate: [AuthGuard]},
  {path: 'invitations/accept', component: AcceptComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: '/admin', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
