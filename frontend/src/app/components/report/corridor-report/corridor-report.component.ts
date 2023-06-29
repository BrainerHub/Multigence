import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { BootstrapService } from 'app/services/bootstrap.service';
import { HttpClient, HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-corridor-report',
  templateUrl: './corridor-report.component.html',
  styleUrls: ['./corridor-report.component.scss'],
})
export class CorridorReportComponent implements OnChanges{
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
  //QuestionaryStatus: any;
  users: any;
  trial: boolean;
  personListPages: any;
 // send: boolean = true;
  sortOrder = 'Closest';
  sortOrders = 'Furthest';
  isAscendingSort: boolean = false;
  //expand: boolean;
  department: any = '13eeff42-f6b3-4eac-9214-556f467a8fea';
  department2:any;
  pagesSelected: any;
  MAX_PERSONS_IN_CORRIDOR = 5;
  onUserSelected: boolean = false;
  employeesData: any;
  selectedEmployeeGroup: any;
  selectedDepartment:  string | undefined;
  selectedDepartment2: string | undefined;
  fName: any;
  lName: any;
  selectedEmployee: string | undefined;
  selectedEmployee2: string | undefined;
  departmentobjects: any = [{'department': null, 'source': 'employees'}];
  invitationDepartment: any;
  invitationEmployee: any;
  selectedUser: any;
  selectedSorting: any;
  showComparedata: boolean =false;
  ShowData: boolean = true;
  visiblityData: boolean = false;
  d1 :any;
  d2:any;
  employee1 :any;
  employee2:any;
  @Input() item : any
  @Input() items: any[] = [];
  selectedDept:any =[];
  selectedEmp:any[] =[];
  employeeData= [
    { id: 'employees', name: 'EMPLOYEES'},
    { id: 1, name: 'employee 1' },
    { id: 2, name: 'employee 2' },
    { id: 3, name: 'employee 3' },
    { id: 4, name: 'employee 4' },
    { id: 5, name: 'employee 5' },
  ]
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private _translate: TranslateService,
    public _router: Router,
    private bootstrapService: BootstrapService
  ) {
   
  }
  ngOnChanges(): void {
    
  }

  ngOnInit(){
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
      //this.getCorridorReport1();
      this.getCorridorReport();
      this.getpersonListPage();
      this.getPositions();
      this.getUserReport();
    });
  }

  getCorridorEmployee() {
    this.userService
      .getCorridorEmployee(this.organization, this.selectedUser)
      .subscribe((res) => {
        this.employeesData = res.users;
      });
  }

  getDepartment() {
    this.userService.getDepartments(this.organization).subscribe((res) => {
      var userDepartmentData = Array.from(Object.values(res));
      this.departments = userDepartmentData[0];
      this.department2 =  userDepartmentData[0];
    });
  }
  
  getCorridorReport() {
    const selectedObj = JSON.stringify(this.departmentobjects);
      this.userService.getCorridorReport(this.organization, selectedObj).subscribe((res) => {
          this.item = res;
          this.items= res;
          localStorage.setItem('defultDepartment', JSON.stringify(res));
        });
    }
  
  setDepartment(department: any) {
    this.d1 = department.uuid
    this.selectedDepartment = department.name
    this.departmentobjects[0]['department'] = department.uuid
    //this.getUserReport();
    this.selectedEmp.push({department:this.d1});
    this.getCorridorReport();
    this.getCorridorDepartmentReport();
  }

  setDepartment2(department:any) {
    this.d2 = department.uuid
    this.selectedDepartment2 = department.name
    this.invitationDepartment = department.uuid
    if (this.departmentobjects.length == 1){
      this.departmentobjects.push({'department': department.uuid, 'source': 'employees'})
    } else {
      this.departmentobjects[1]['department'] = department.uuid
    }
    this.getCorridorReport();
    this.getCorridorDepartmentReport();
  }

  setEmployee(employee: any){
    this.employee1 = employee.id
    this.selectedEmp.push({department:this.d1, source:this.employee1});
    this.selectedEmployee = employee.name;
    if (this.departmentobjects == 0){
      this.departmentobjects.push({'department': null, 'source': employee.id})
    } else {
      this.departmentobjects[0]['source'] = employee.id
    }
    this.getCorridorReport();
  }
  setEmployee2(employee: any){
    this.employee2 = employee.id
    this.selectedEmployee2 = employee.name;
    this.selectedEmp.push({department:this.d2, source:this.employee2});
    if (this.departmentobjects.length == 1){
      this.departmentobjects.push({'department': null, 'source': employee.id})
    } else {
      this.departmentobjects[1]['source'] = employee.id
    }

    this.getCorridorReport();
  }
  compare(){
    this.showComparedata = true;
    this.getCorridorDepartmentReport();
  }
  
  setSource(employee: any) {
    this.fName = employee.first_name;
    this.lName = employee.last_name;
    this.selectedEmployee = employee.first_name + ' ' + employee.last_name;
    this.selectedEmployeeGroup = employee.uuid;
    this.getCorridorEmployeeReport();
    this.getUserReport();
  }

  setEmployeeUser(event: any) {
    this.selectedUser = event;
    this.getCorridorEmployee();
    this.getUserReport();
  }

  setCandidateUser(candidate: any) {
    this.selectedUser = candidate;
    this.getCorridorCandidate();
    this.getUserReport();
  }

  getDescription(user: any) {
    if (user?.role === this.ROLE_EMPLOYEE) {
      return user?.title;
    } else if (user?.role === this.ROLE_APPLICANT) {
      return user['position_name'];
    } else {
      return null;
    }
  }

  setSorting(event: any) {
    if (localStorage.getItem('selectedLanguage') == 'de') {
      if (event == 'Closest') {
        event = 'Am nächsten';
      } else {
        event = 'Am weitesten';
      }
      this.selectedSorting = event;
    }
    if (localStorage.getItem('selectedLanguage') == 'en') {
      if (event == 'Closest') {
        event = 'Closest';
      } else {
        event = 'Furthest';
      }
      this.selectedSorting = event;
    }
    this.sortOrder = this.sortOrder === 'Closest' ? 'Furthest' : 'Closest';
    this.sortOrders = this.sortOrders === 'Closest' ? 'Furthest' : 'Closest';
    this.selectedSorting = this.getUserReport();
    let uuid = this.user.uuid;
    this.userService.getReportUser(uuid).subscribe((res) => {
      this.personListPage = res;
      this.titles = res[0];
    });
    this.selectedSorting = event;
  }

  onSeachDropdownValue($event: any) {
    const value = $event.target.value;
    this.employees = this.employee.filter((employee: string | any[]) =>
      employee.includes(value)
    );
  }

  onShowAllData() {
    this.ShowData = !this.ShowData;
    this.visiblityData = !this.visiblityData;
  }

  setUser(event: any) {
    this.selectedUser = event;
    this.getUserReport();
    this.getCorridorReport();
  }

  getUserReport() {
    this.userService.getUserReport(this.user.uuid).subscribe((res) => {});
  }

  getStatus() {}
  
  toggleUser(user: any) {
    if (!user.selected) {
      user.page = this.page;
      this.onUserSelected = true;
      if (this.corridorPersons.length < this.MAX_PERSONS_IN_CORRIDOR) {
        this.corridorPersons = this.corridorPersons.concat([user]);
        user.selected = true;
        this.pagesSelected?.push(this.page);
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
    this.selectedSorting = this.getUserReport();
    let uuid = this.user.uuid;
    this.userService.getReportUser(uuid).subscribe((res) => {
      this.personListPage = res;
      this.titles = res[0];
      
    });
  }
  
  getCorridorDepartmentReport() {
    this.userService
      .getCorridorDepartmentReport(this.organization, this.invitationDepartment)
      .subscribe((res) => {
        this.employeesData = res;
        this.items = res;
      });
  }


  getCorridorEmployeeReport() {
    this.userService
      .getCorridorEmployeeReport(this.organization, this.selectedDept)
      .subscribe((res) => {
        this.employeesData = res.users;
      });
  }

  getCorridorCandidate() {
    this.userService
      .getCorridorCandidate(this.organization, this.selectedUser)
      .subscribe((res) => {
        this.employeesData = res.users;
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
}
