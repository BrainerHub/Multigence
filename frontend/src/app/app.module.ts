import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { LoginLayoutComponent } from './components/login/login-layout/login-layout.component';
import { ChangePasswordComponent } from './components/login/change-password/change-password.component';
import { ForgetPasswordComponent } from './components/login/forget-password/forget-password.component';
import { SignupComponent } from './components/login/signup/signup.component';
import { UserService } from './services/user.service';
import { AuthInterceptor } from './Interceptor/auth.interceptor';
import { ErrorInterceptor } from './Interceptor/error.interceptor';
import { LayoutComponent } from './components/layout/layout.component';
import { LayoutHeaderComponent } from './components/layout/layout-header/layout-header.component';
import { AdminComponent } from './components/admin/admin/admin.component';
import { AdminFooterComponent } from './components/admin/admin-footer/admin-footer.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule,PaginationConfig } from 'ngx-bootstrap/pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './components/profile/profile.component';
import { AccountComponent } from './components/account/account.component';

import { InvitationsComponent } from './components/invitations/invitations.component';
import { AcceptComponent } from './components/invitations/accept/accept.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { UserFooterComponent } from './components/user-layout/user-footer/user-footer.component';
import { UserHeaderComponent } from './components/user-layout/user-header/user-header.component';
import { ProgressComponent } from './components/progress/progress.component';
import { QuestionaryComponent } from './components/questionary/questionary.component';
import { ReportComponent } from './components/report/report.component';
import { ContentComponent } from './components/content/content.component';
import { DataLoadComponent } from './components/data-load/data-load.component';
import { TestComponent } from './components/test/test.component';
import { ProgressFooterComponent } from './components/layout/progress-footer/progress-footer.component';
@NgModule({
  declarations: [
    AppComponent,
    AcceptComponent,
    InvitationsComponent,
    LoginComponent,
    LoginLayoutComponent,
    ChangePasswordComponent,
    ForgetPasswordComponent,
    SignupComponent,
    AdminComponent,
    LayoutComponent ,
    LayoutHeaderComponent,
    AdminFooterComponent,
    AdminUsersComponent,
    ProfileComponent,
    AccountComponent,
    UserFooterComponent,
    UserHeaderComponent,
    ProgressComponent,
    QuestionaryComponent,
    ReportComponent,
    ContentComponent,
    DataLoadComponent,
    TestComponent,
    ProgressFooterComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxPaginationModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
   // PaginationConfig ,
    ModalModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
