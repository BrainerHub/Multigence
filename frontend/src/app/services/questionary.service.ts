import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionaryService {

  constructor(private http: HttpClient, public router:Router, private userService: UserService) { }

  getAll(user:any, params:any): Observable<any> {
    return this.getUserId(user).pipe(
     switchMap((userId) => {
       params = params || {};
        // return this.getDefaultLang().pipe(
        //   switchMap((lang) => {
        //     if (lang) {
        //       // take only the language part and not the country
           
        //     }
            return this.userService.getUserQuestionaries(userId).pipe(
              map((response) => response.data)
            );
          })
       );
     // })
   // );
  }




  // postAnswer(questionaryId:any, answer:any): Observable<any> {
  //   return this.getUserId().pipe(
  //     switchMap((userId) => {
  //       debugger
  //       return this.userService.postUserQuestionaryAnswer(userId, questionaryId, answer).pipe(
  //         map((response) => response.data)
  //       );
  //     })
  //   );
  // }

   postAnswer(questionaryId:any, answer:any,userId:any): Observable<any> {
        debugger
        return this.userService.postUserQuestionaryAnswer(userId, questionaryId, answer).pipe(
          map((response) => response.data)
        );
  }

 
  // getAnswers(questionaryId:any): Observable<any> {
  //   return this.getUserId().pipe(
  //     switchMap((userId) => {
  //       return this.userService.getUserQuestionaryAnswers(userId, questionaryId).pipe(
  //         map((response) => response.data)
  //       );
  //     })
  //   );
  // }
  
  getAnswers(questionaryId:any , userId:any): Observable<any> {

    return this.userService.getUserQuestionaryAnswers(userId, questionaryId).pipe(
          map((response) => response.data)
        );
    
   
  }
  
  getUserId(userId?:any): Observable<any> {
    const user = userId || new URLSearchParams(window.location.search).get('user');
    if (user) {
      return of(user);
    }
    return this.userService.getMe().pipe(
      map((response) => response.data)
    );
  }

  // private getDefaultLang(): Observable<any> {
  //   return this.http.get('api/i18n/defaultLang').pipe(
  //     map((response) => response)
  //   );
  // }
}
