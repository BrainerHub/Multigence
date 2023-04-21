import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, map } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BootstrapService {
  user: any;
  ROLE_MANAGER = 'MANAGER';
  ROLE_EMPLOYEE = 'EMPLOYEE';
  ROLE_APPLICANT = 'APPLICANT';
  ROLE_ADMIN = 'ADMIN';

  constructor(private http: HttpClient, public router:Router, private userService: UserService,) {}



 
  bootstrap() {
    this.userService.getMe().subscribe((res: any) => {
      this.user = res;
      if(this.user.role =='MANAGER'){
        this.router.navigate(['/invitations']);
      }else if(this.user.role == 'ADMIN'){
        this.router.navigate(['/admin']);
      }else{
        this.router.navigate(['/profile']);
      }
    });
  }


  getDescription(user: any) {
    if(this.user.role === this.ROLE_EMPLOYEE) {
      return this.user.title;
    }
    else if(this.user.role === this.ROLE_APPLICANT) {
      return user['position_name'];
    }
    else {
      return null;
    }
  }
}
