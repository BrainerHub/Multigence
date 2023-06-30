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
@Component({
  selector: 'app-corridor-report',
  templateUrl: './corridor-report.component.html',
  styleUrls: ['./corridor-report.component.scss'],
})
export class CorridorReportComponent implements OnChanges {
  searchText: any;
  ROLE_EMPLOYEE = 'EMPLOYEE';
  ROLE_APPLICANT = 'APPLICANT';
  personListPage: any;
  titles: any;
  page = 1;
  positions: any;
  departments: any;
  employee: any;
  organization: any = [];
  user: any;
  employees: any = [];
  progressOrganization: any;
  trial: boolean;
  sortOrder = 'Closest';
  sortOrders = 'Furthest';
  department: any = '13eeff42-f6b3-4eac-9214-556f467a8fea';
  department2: any;
  onUserSelected: boolean = false;
  employeesData: any;
  selectedDepartment: string | undefined;
  selectedDepartment2: string | undefined;
  firstName: any;
  lastName: any;
  selectedEmployee: string | undefined;
  selectedEmployee2: string | undefined;
  departmentobjects: any = [{ 'department': null, 'source': 'employees' }];
  invitationDepartment: any;
  selectedUser: any;
  selectedSorting: any;
 // showComparedata: boolean = false;
  ShowData: boolean = true;
  visiblityData: boolean = false;
  setSelectedDepartment1: any;
  setSelectedDepartment2: any;
  employee1: any;
  employee2: any;
  @Input() items: any;
  @Input() empitem: any = [];
  selectedDept: any = [];
  selectedEmp: any[] = [];
  selectedUsers: any = [];
  selectedDepartments: string[] = [];
  constructor(
    private userService: UserService,
    public _router: Router,
  ) {
    
  }
  ngOnChanges(): void {

  }

  ngOnInit() {
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
      this.department2 = userDepartmentData[0];
    });
  }

  getCorridorReport() {
    const selectedObj = JSON.stringify(this.departmentobjects);
    this.userService.getCorridorReport(this.organization, selectedObj).subscribe((res) => {
      this.items = res;
      localStorage.setItem('defultDepartment', JSON.stringify(res));
    });
  }


setDepartments(department: any) {
  const index = this.selectedDepartments.indexOf(department.name);
  if (index !== -1) {
    this.selectedDepartments.splice(index, 1);
  } else {
    this.setSelectedDepartment1 = department.uuid
    this.selectedDepartments.push(department.name);
    this.invitationDepartment = department.uuid
    if (this.departmentobjects) {
      this.departmentobjects.push({ 'department': department.uuid, 'source': 'employees' })
    } else {
      this.departmentobjects['department'] = department.uuid
    }
    this.getCorridorReport();
    this.getCorridorDepartmentReport();
   }
}
  // setDepartment(department: any) {
  //   this.setSelectedDepartment1 = department.uuid
  //   this.selectedDepartment = department.name
  //   this.departmentobjects[0]['department'] = department.uuid
  //   //this.getUserReport();
  //   this.selectedEmp.push({ department: this.setSelectedDepartment1 });
  //   this.getCorridorReport();
  //   this.getCorridorDepartmentReport();
  // }

  // setDepartment2(department: any) {
  //   this.setSelectedDepartment2 = department.uuid
  //   this.selectedDepartment2 = department.name
  //   this.invitationDepartment = department.uuid
  //   if (this.departmentobjects.length == 1) {
  //     this.departmentobjects.push({ 'department': department.uuid, 'source': 'employees' })
  //   } else {
  //     this.departmentobjects[1]['department'] = department.uuid
  //   }
  //   this.getCorridorReport();
  //   this.getCorridorDepartmentReport();
  // }

  setEmployee(employee: any) {
    this.employee1 = employee.uuid
    this.firstName = employee.first_name;
    this.lastName = employee.last_name;
    this.selectedEmployee = employee.first_name + ' ' + employee.last_name;
    this.selectedEmp.push({ department: this.setSelectedDepartment1, source: this.employee1 });
    if (this.departmentobjects == 0) {
      this.departmentobjects.push({ 'department': null, 'source': employee.uuid })
    } else {
      this.departmentobjects[0]['source'] = employee.uuid
    }
    this.getCorridorReport();
  }
  setEmployee2(employee: any) {
    this.employee2 =  employee.uuid
    this.firstName = employee.first_name;
    this.lastName = employee.last_name;
    this.selectedEmployee2 = employee.first_name + ' ' + employee.last_name;
    this.selectedEmp.push({ department: this.setSelectedDepartment2, source: this.employee2 });
    if (this.departmentobjects.length == 1) {
      this.departmentobjects.push({ 'department': null, 'source': employee.uuid })
    } else {
      this.departmentobjects[1]['source'] = employee.uuid
    }
    this.getCorridorReport();
  }
  // compare() {
  //   this.showComparedata = true;
  //   this.getCorridorDepartmentReport();
  // }

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
    this.userService.getUserReport(this.user.uuid).subscribe((res) => { });
  }

  showUserIndicators(employee: any){
    if (this.selectedUsers.includes(employee.uuid)){
      this.selectedUsers = this.selectedUsers.filter((user:any) => user != employee.uuid)
    } else {
      this.selectedUsers.push(employee.uuid)
    }
    this.empitem = this.items?.users.filter((item: any) => {
      return this.selectedUsers.includes(item.uuid)
    })
  }

  getInviteOrganization() {
    this.userService
      .getInviteOrganization(this.organization)
      .subscribe((res) => {
        var userInviteData = Array.from(Object.values(res));
        this.trial = res.trial;
        this.progressOrganization = userInviteData[0];
      });
  }

  getSpheres() {
    this.userService.getSpheres().subscribe((res) => {
    });
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
        this.employees = res.employees;
      });
  }
}
