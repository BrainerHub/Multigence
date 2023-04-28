import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { BootstrapService } from 'app/services/bootstrap.service';

@Component({
  selector: 'app-corridor-report',
  templateUrl: './corridor-report.component.html',
  styleUrls: ['./corridor-report.component.scss'],
})
export class CorridorReportComponent {
  searchText: any;
  ROLE_EMPLOYEE = 'EMPLOYEE';
  ROLE_APPLICANT = 'APPLICANT';
  personListPage: any;
  IsVisible: boolean = false;
  titles: any;
  page = 1;
  userRolList: any = [];
  positions: any;
  visible: boolean = false;
  departments: any;
  employee: any;
  organization: any = [];
  corridorPersons: any = [];
  user: any;
  employees: any;
  postions: any;
  submitted!: boolean;
  progressOrganaiztion: any;
  QuestionaryStatus: any;
  users: any;
  trial: boolean;
  personListPages: any;
  send: boolean = true;
  sortOrder = 'Closest';
  sortOrders = 'Furthest';
  isAscendingSort: boolean = false;
  expand: boolean;
  department: any;
  pagesSelected: any;
  MAX_PERSONS_IN_CORRIDOR = 5;
  onUserSelected: boolean = false;
  employeesData: any;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private _translate: TranslateService,
    public _router: Router,
    private bootstrapService: BootstrapService
  ) {}

  ngOnInit(): void {
    this.getMe();
  }

  getMe() {
    this.userService.getMe().subscribe((res: any) => {
      this.user = res;
      this.organization = res.company;
      this.getDepartment();
      this.getOrganizationUsers();
      this.getInviteOrganization();
      this.getSpheres();
      this.getCorridorReport();
      this.getpersonListPage();
      this.getPositions();
      this.getCorridorDepartmentReport();
      this.getUserReport();
     
    });
  }

  setDepartment(department: any) {
    if (this.department !== this.department) {
      this.departments = this.departments.uuid;
    }
    this.getUserReport();
    this.getCorridorDepartmentReport();
  }

  getDescription(user: any) {
    if (user.role === this.ROLE_EMPLOYEE) {
      return user.title;
    } else if (user.role === this.ROLE_APPLICANT) {
      return user['position_name'];
    } else {
      return null;
    }
  }


  setSource(employee: any){
    if (this.department !== this.department) {
      this.departments = this.departments.uuid;
    }
   this.getCorridorEmployeeReport();
   this.getUserReport();
    
  }
  onSeachDropdownValue($event: any) {
    const value = $event.target.value;
    this.employees = this.employee.filter((employee: string | any[]) =>
      employee.includes(value)
    );
  }

  onSelectDropdownValue(option: any) {
    // Do something with selected value
  }
  getDepartment() {
    this.userService.getDepartments(this.organization).subscribe((res) => {
      var userDepartmentData = Array.from(Object.values(res));
      this.departments = userDepartmentData[0];

    });
  }


  //issue
  getUserReport() {
    this.userService.getUserReport(this.user.uuid).subscribe((res) => {
    });
  }
  
  getStatus() {}
  toggleUser(user: any) {
    if (!user.selected) {
      user.page = this.page;
      this.onUserSelected = true;
      if (this.corridorPersons.length < this.MAX_PERSONS_IN_CORRIDOR) {
        this.corridorPersons = this.corridorPersons.concat([user]);
        user.selected = true;
        this.pagesSelected.push(this.page);
      }
    } else {
      user.selected = false;
      this.onUserSelected = false;
    }
  }

  getInviteOrganization() {
    this.userService
      .getInviteOrganization(this.organization)
      .subscribe((res) => {
        var userInviteData = Array.from(Object.values(res));
        this.trial = res.trial;
        this.progressOrganaiztion = userInviteData[0];
      });
  }

  getSpheres() {
    this.userService.getSpheres().subscribe((res) => {});
  }

  get sortedData() {
    return this.user.sort((a: any, b: any) => {
      if (this.sortOrder === 'Closest') {
        return a - b;
      } else if (this.sortOrders === 'Furthest') {
        return a - b;
      } else {
        return b - a;
      }
    });
  }

  getpersonListPage() {
    this.sortOrder = this.sortOrder === 'Closest' ? 'Furthest' : 'Closest';
    this.sortOrders = this.sortOrders === 'Closest' ? 'Furthest' : 'Closest';
    this.getUserReport();
    let uuid = this.user.uuid;
    this.userService.getReportUser(uuid).subscribe((res) => {
      this.personListPage = res;
      this.titles = res[0];
    
    });
  }

  getCorridorReport() {
    this.userService
      .getCorridorReport(this.organization)
      .subscribe((res) => {});
  }

  getCorridorDepartmentReport() {
    this.userService.getCorridorDepartmentReport(this.organization, this.departments[0].uuid).subscribe((res) => {
        this.employeesData = res.users;
      });
  }

  getCorridorEmployeeReport() {
    this.userService.getCorridorEmployeeReport(this.organization, this.users.uuid).subscribe((res) => { 
    });
  }


  getPositions() {
    this.userService.getPositions(this.organization).subscribe((res) => {
      this.positions = res[0];
    });
  }

  getOrganizationUsers() {
    this.userService
      .getOrganizationUsers(this.organization, this.departments)
      .subscribe((res) => {
        var usertitleData = res;
        this.employees = usertitleData.employees;
        this.users = usertitleData.employees[0];
      });
  }

  // getUsers(organizationId:any, departmentId:any) {
  //  this.userService.getDepartmentInfo(organizationId, departmentId).subscribe((res =>{

  //  }))
  // }
}
