import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin/admin.component';
import { LayoutHeaderComponent } from './components/layout/layout-header/layout-header.component';
import { LayoutComponent } from './components/layout/layout.component';
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
 // {path: '', redirectTo: 'admin', pathMatch: 'full',},
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent,canActivate: [AuthGuard]},
  {path: 'reset-password', component: ForgetPasswordComponent},
  {path: 'change-password', component: ChangePasswordComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  {path: 'users', component: AdminUsersComponent},
  {path: 'account', component: AccountComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'content', component: ContentComponent},
  {path: 'import', component: DataLoadComponent},
  {path: 'test', component: TestComponent},
  {path: 'progress', component: ProgressComponent},
  {path: 'invitations', component: InvitationsComponent},
  {path: 'accept', component: AcceptComponent},
  {path: 'questionary', component: QuestionaryComponent},
  {path: 'report', component: CorridorReportComponent},
  {path: 'layo', component: CorridorLegendItemComponent},
  {path: 'questionary/report', component: QuestionaryReportComponent},
  {path: '**', redirectTo: '/admin', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
