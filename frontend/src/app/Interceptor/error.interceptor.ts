import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => {
      console.log(err.status);
      if(err.status != 200) {
        // auto logout
        

       // this.userService.logout();

      }
      //alert(err.statusText);

      const error = err.error.message || err.statusText;
      return throwError(err.error.message);
    }))
  }
}
