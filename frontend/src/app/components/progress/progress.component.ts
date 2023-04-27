import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
// import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent {
  searchText: any;
  usersPage: any = [];
  progressList: any;
  userRolList: any = [];
  user: any;
  data: any;
  departments: any;
  organization: any = [];
  titles: any = [];
  positions: any = [];
  userStatus: any = [];
  userStatusListPage: any;
  questionStatus:any;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    public route: ActivatedRoute,
     public _router: Router,
  ) {}
  ngOnInit() {
    this.progressList = ['Pending', 'Progressing', 'Finished'];
    this.userRolList = ['All users', 'Employee', 'Candidate'];
    this.getMe();
    this.getInfo();
  }

  getMe() {
    this.userService.getMe().subscribe((res: any) => {
      this.user = res;
      this.organization = res.company;
      this.getDepartment();
      this.getPositions();
      this.getOrganization();
      this.getQuestionaryStatus();
      this.getOrganizationUsers();

      
    });
  }
  getInfo() {}



   viewResult(){
    this._router.navigate(['/report']);
  }


  getDepartment() {
    this.userService.getDepartments(this.organization).subscribe((res) => {
      var userDepartmentData = Array.from(Object.values(res));
      this.departments = userDepartmentData[0];
    });
  }

  getPositions() {
    this.userService.getPositions(this.organization).subscribe((res) => {
     this.positions = res[0]
    });
  }
  getOrganization() {
    this.userService.getOrganization(this.organization).subscribe((res) => {


    });
  }

  getQuestionaryStatus() {
    this.userService.getQuestionaryStatus(this.organization).subscribe((res) => {
      var userData = Array.from(Object.values(res));
      this.userStatusListPage = userData[0];
      
    });
  }

  getOrganizationUsers(){
    this.userService.getOrganizationUsers(this.organization,this.departments).subscribe((res) => {
     this.usersPage = res.employees;
     console.log(" this.usersPage ", this.usersPage );
     
    });
  }
}
