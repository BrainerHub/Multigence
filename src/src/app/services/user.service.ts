import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
 

  apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, public router:Router) {}


    // Login User
  login(data: any) {
    return this.http.post<any>(`${this.apiUrl}` + '/login/', data).pipe(
      map((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      })
    );
  }

  // SignUp User
  signUp(data: any) {
    return this.http.post<any>(`${this.apiUrl}` + '/register/', data).pipe(
      map((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      })
    );
  }

// Reset Password
  sendEmailResetPassword(data: any) {
    return this.http.post<any>(`${this.apiUrl}` + '/resetPassword/', data).pipe(
      map((user) => {
        return user;
      })
    );
  }

  //Change Password
  changePassword(data: any){
    return this.http.post<any>(`${this.apiUrl}` + '/changePassword/', data).pipe(
      map((user) => {
        console.log(user);
        
      })
    );
  }

 //user logOut
  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

    // get token
    getToken() {
      return localStorage.getItem('authToken');
    }
    //create new organization
    createOrganization(data: any) {
      return this.http.post<any>(`${this.apiUrl}` + '/organization/', data).pipe(
        map((user) => {
          return user;
        })
      );
    }


    // get organization list
    getOrganizations() {
      return this.http.get<any>(`${this.apiUrl}` + '/organization/').pipe(
        map((user) => {
          return user;
        })
      );
    }
  //get all departments list
    getDepartments(organizationId:any) {
      return this.http.get<any>(`${this.apiUrl}` + '/organization/' + organizationId + '/department/',).pipe(
        map((user) => {
          return user;
        })
      );
    }

   //delete Organisation
   deleteOrganization(id:any) {
    return this.http.delete<any>(`${this.apiUrl}` + '/organization/'+id+'/',).pipe(
      map((user) => {
        return user;
      })
    );
  }

   //update Organisation
  updateOrganization(uuid:any, data:any ) {
    return this.http.patch<any>(`${this.apiUrl}` + '/organization/'+uuid+'/', data).pipe(
      map((user) => {
        return user;
      })
    );
  }
 
 //Invite
 invite(data:any) {
  return this.http.post<any>(`${this.apiUrl}` + '/invite/',data).pipe(
    map((user) => {
      return user;
    })
  );
}

 // get User
  getUser() {
    return this.http.get<any>(`${this.apiUrl}` + '/user/').pipe(
      map((user) => {
        return user;
      })
    );
  }

   //delete User
   deleteUser(userId:any) {
    return this.http.delete<any>(`${this.apiUrl}` + '/user/'+userId+'/',).pipe(
      map((user) => {
        return user;
      })
    );
  }
  
  findUsers(params:any) {
    return this.http.get<any>(`${this.apiUrl}` + '/user/', params).pipe(
      map((user) => {
        return user;
      })
    );
  }

//get user list data
getMe() {
    return this.http.get<any>(`${this.apiUrl}` + '/user/me/').pipe(
      map((user) => {
        return user;
      })
    );
  }

//update user  list data
  updateMe(data: any) {
    return this.http.patch<any>(`${this.apiUrl}` + '/user/me/', data).pipe(
      map((user) => {
        return user;
      })
    );
  }

 
}
