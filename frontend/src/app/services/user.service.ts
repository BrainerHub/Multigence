import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'enviroment/enviroment';
import { Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  ROLE_MANAGER = 'MANAGER';
  ROLE_EMPLOYEE = 'EMPLOYEE';
  ROLE_APPLICANT = 'APPLICANT';
  ROLE_ADMIN = 'ADMIN';
  me: any;
  storage = sessionStorage;
  apiUrl = environment.api;
  utils: any;
  private headers = {
    headers: new HttpHeaders({
      'Content-Type': ' ', 
      "Authorization":`Token`
     
      
    }),
  };
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
        return user;
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


   // get organization with id
    getOrganization(id:any) {
      return this.http.get<any>(`${this.apiUrl}` + '/organization/'+id+'/').pipe(
        map((user) => {
          return user;
        })
      );
    }

  
  //get all departments list
    getDepartments(organizationId:any) {
      return this.http.get<any>(`${this.apiUrl}` + '/organization/' + organizationId + '/department/').pipe(
        map((user) => {
          return user;
        })
      );
    }
    //add department
    addDepartament(organizationId:any, department:any) {
     
      return this.http.post<any>(`${this.apiUrl}` +'/organization/' + organizationId + '/department/', department).pipe(
        map((name) => {
          return name;
        })
      );
    
    }
 
//addposition
addPosition(organizationId:any , position:any) {
  return this.http.post<any>(`${this.apiUrl}` +'/organization/' + organizationId + '/position/', position).pipe(
    map((job) => {
      return job;
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
  updateOrganization(uuid:any, datas:any ) {
    return this.http.patch<any>(`${this.apiUrl}` + '/organization/'+uuid+'/', datas).pipe(
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
getInvitation(uuid:any) {
  return this.http.get<any>(`${this.apiUrl}` + '/invite/' + uuid + '/').pipe(
    map((user) => {
      return user;
    })
  );
  // var req = _getRequest('/invite/' + uuid + '/', {}, false);
  // return $http(req);
}

acceptInvitation(uuid:any, data:any) {
  return this.http.patch<any>(`${this.apiUrl}` +'/invite/' + uuid + '/' ,data).pipe(
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

  //getAll user
  getAllUsers(filters:any) {
    return this.http.get<any>(`${this.apiUrl}` + '/user/' + '?organization=' + filters.organization + '&role=' + filters.role).pipe(
      map((alluser) => {
        return alluser;
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

  //question upload

  uploadQuestions(file:any) {
    var fd = new FormData();
    fd.append('file', file);
    return this.http.post<any>(`${this.apiUrl}` + '/questionUpload/', fd).pipe(
          map((user) => {
            return user;
          })
        );
    }


  //get position
  getPositions(organizationId:any) {
    return this.http.get<any>(`${this.apiUrl}` +'/organization/' + organizationId + '/position/').pipe(
      map((user) => {
        return user;
      })
    );
  }




  getDescription(user:any) {
    if(user.role === this.ROLE_EMPLOYEE) {
      return user.title;
    }
    else if(user.role === this.ROLE_APPLICANT) {
      return user['position_name'];
    }
    else {
      return null;
    }
  }


  isLoggedSync() {
    if(localStorage['token']) {
      this.storage = localStorage;
    }
    return this.storage['token'] !== undefined && this.storage['token'] !== null;
  }


  isAdminSync() {
    if(!this.isLoggedSync()){
      return false;
    }
    return this.me && this.me.role === this.ROLE_ADMIN;
  }


  isAdmin() {
    return this.getMe().subscribe((user) => {
      return user.role === this.ROLE_ADMIN;
    });
  }



  isManager() {
      return this.getMe().subscribe((user) => {
        return user.role === this.ROLE_MANAGER;
      });
  }

  isManagerSync() {
      if(!this.isLoggedSync()){
        return false;
      }
      return this.me && this.me.role === this.ROLE_MANAGER;
  }
  
  getQuestionaryStatus(organizationId:any) {
    return this.http.get<any>(`${this.apiUrl}` +'/organization/' + organizationId + '/questionary/status/').pipe(
      map((user) => {
        return user;
      })
    );
  }

  getUserQuestionaryAnswers(userId:any, questionaryId:any){
    return this.http.get<any>(`${this.apiUrl}` +'/user/' + userId + '/questionary/' + questionaryId + '/answer/').pipe(
      map((user) => {
        return user;
      })
    );
  }

  postUserQuestionaryAnswer(userId:any, questionaryId:any, answer:any){
    return this.http.post<any>(`${this.apiUrl}` +'/user/' + userId + '/questionary/' + questionaryId + '/answer/', answer).pipe(
      map((user) => {
        return user;
      })
    );
  }



  getOrganizationUsers(organizationId:any, departmentId:any) {
    var params = {};
    if (departmentId !== undefined) {
      params = departmentId;
    }
    return this.http.get<any>(`${this.apiUrl}` +'/organization/' + organizationId + '/user/',params).pipe(
      map((user) => {
        return user;
      })
    );
   
  }

  getInviteOrganization(uuid: any) {
    return this.http.get<any>(`${this.apiUrl}` +  '/organization/' + uuid + '/').pipe(
      map((user) => {
        return user;
      })
    );
  }


  //sphere

  getSpheres () {
    return this.http.get<any>(`${this.apiUrl}` + '/sphere/').pipe(
      map((sphere) => {
        return sphere;
      })
    );
  
  }

  getCorridorReport(organizationId:any) {
   
    return this.http.get<any>(`${this.apiUrl}` +'/organization/' + organizationId + '/report/corridor/'+'?destination=All+users&source=employees').pipe(
      map((report) => {
        return report;
      })
    );
  
  }

  getOrganizationData(organizationId:any) {
    return this.http.get<any>(`${this.apiUrl}` +'/organization/'+organizationId+'/').pipe(
      map((user) => {
        return user;
      })
    );
    
  }
 //get UserQuestionaries
 getUserQuestionaries(userId: any, ) {
    return this.http.get<any>(`${this.apiUrl}` + '/user/' + userId + '/questionary/').pipe(
      map((sphere) => {
        return sphere;
      })
    );
  
  }

 
}
 


