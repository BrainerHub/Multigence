import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'enviroment/enviroment';
import { Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // postAnswer(userId: any, questionaryId: any, answer: { questionId: any; options: any; }) {
  //   throw new Error('Method not implemented.');
  // }
  ROLE_MANAGER = 'MANAGER';
  ROLE_EMPLOYEE = 'EMPLOYEE';
  ROLE_APPLICANT = 'APPLICANT';
  ROLE_ADMIN = 'ADMIN';
  lang:any 
  loadLang: Subject<any> = new Subject();
  me: any;
  storage = sessionStorage;
  apiUrl = environment.api;
  utils: any;
  url: string;
  
  
  private valuesSource = new Subject<{ value1: string, value2: number }>();
  values$ = this.valuesSource.asObservable();
  
  constructor(private http: HttpClient, public router:Router) {
    this.url = environment.api
  }

  updateValues(value1: any, value2: any) {
    this.valuesSource.next({ value1, value2 });
  }


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
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
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

  //get report user 
  getReportUser(userId:any) {
    return this.http.get<any>(`${this.apiUrl}` +'/user/' + userId + '/').pipe(
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
  
  getUserReport(userId:any){
    return this.http.get<any>(`${this.apiUrl}` + '/user/'+userId+'/',).pipe(
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


  getQuestionaryReport(organizationId:any, questionaryId: any) {
    return this.http.get<any>(`${this.apiUrl}` +'/organization/' + organizationId + '/report/questionary/' + questionaryId).pipe(
      map((user) => {
        return user;
      })
    );
  }

  getQuestionarySummaryReport(organizationId:any, questionaryId: any) {
    return this.http.get<any>(`${this.apiUrl}` +'/organization/' + organizationId + '/report/questionary-summary/' + questionaryId).pipe(
      map((user) => {
        return user;
      })
    );
  }

  getUserQuestionaryAnswers(userId:any, questionaryId:any){
    var answered = {};
    answered = true ;
    return this.http.get<any>(`${this.apiUrl}` +'/user/' + questionaryId + '/questionary/' + userId + '/answer/', answered).pipe(
      map((user) => {
        return user;
      })
    );
  }
  
  postUserQuestionaryAnswer(userId:any, questionaryId:any, answer?:any) {
    return this.http.post<any>(this.apiUrl + '/user/' + userId + '/questionary/' + questionaryId + '/answer/', answer);
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


  getCorridorEmployee(organizationId:any , userId:any) {
    return this.http.get<any>(`${this.apiUrl}` +'/organization/' + organizationId + '/report/corridor/' +'?destination=employees&source=employees').pipe(
      map((report) => {
        return report;
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

  getCorridorCandidate(organizationId:any , userId:any) {
    return this.http.get<any>(`${this.apiUrl}` +'/organization/' + organizationId + '/report/corridor/' +'?destination=candidate&source=employees').pipe(
      map((report) => {
        return report;
      })
    );
  }
  getCorridorReport(organizationId:any) {
    return this.http.get<any>(`${this.apiUrl}` +'/organization/' + organizationId + '/report/corridor/'+'?destination=all&source=employees').pipe(
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
 getUserQuestionaries(userId: any,res?:any) {
  let getToken = 'Token ' + localStorage.getItem('authToken');
  this.lang = localStorage.getItem('selectedLanguage');
  const headers = new HttpHeaders({
    'Accept-Language': res ? res : this.lang
  });
 const requestOptions = { headers: headers };
    return this.http.get<any>(`${this.apiUrl}` + '/user/' + userId + '/questionary/',requestOptions).pipe(
      map((sphere) => {
        return sphere;
      })
    );
  }

  getCorridorEmployeeReport(organizationId:any , userId:any) {
    return this.http.get<any>(`${this.apiUrl}` +'/organization/' + organizationId + '/report/corridor/' +'?destination=all&source=' + userId).pipe(
      map((report) => {
        return report;
      })
    );
  }
 

  getCorridorDepartmentReport(organizationId:any , departmentId:any) {
    return this.http.get<any>(`${this.apiUrl}` +'/organization/' + organizationId + '/report/corridor/'+'?department=' + departmentId +'&destination=all&source=employees').pipe(
      map((report) => {
        return report;
      })
    );
  }


  multiLinechart() {
    return this.http.get<any>(`${this.apiUrl}` +'/report_sphere/').pipe(
      map((report) => {
        return report;
      })
    );
  }
}
 


