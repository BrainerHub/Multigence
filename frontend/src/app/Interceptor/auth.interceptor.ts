import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let getToken = localStorage.getItem('authToken');
    if (req.url.includes('questionUpload')) {
        let token = getToken == null ? '' : getToken;
        const copiedReq = req.clone({ headers: req.headers.set('Authorization', 'Token') });
        return next.handle(copiedReq);
    }
    if (getToken != null) {
        let token = getToken == null ? '' : getToken;
        const copiedReq = req.clone({ headers: req.headers.set('Authorization', 'Token ' + token) });
        return next.handle(copiedReq)
            .pipe(
                // Log when response observable either completes or errors
                finalize(() => {
                   console.log('err');
                   
                })
            )
    }
    else {
        // this.sharedService.hideLoader();
        return next.handle(req).pipe(
            // Log when response observable either completes or errors
            finalize(() => {
              console.log('err');
            })
        );
    }
}
}
