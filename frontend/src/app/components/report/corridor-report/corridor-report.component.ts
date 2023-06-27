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
export class CorridorReportComponent implements OnChanges{
  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings = {};
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
  selectedEmployee: any;
  invitationDepartment: any;
  invitationEmployee: any;
  selectedUser: any;
  selectedSorting: any;
  showdata: boolean =false;
  ShowData: boolean = true;
  visiblityData: boolean = false;
  itemDisabled1:any;
  d1 :any;
  d2:any;
 
  @Input() item : any
  @Input() items: any[] = [];
  parentMessage = "message from parent";
  selectedDept:any =[];
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private _translate: TranslateService,
    public _router: Router,
    private bootstrapService: BootstrapService
  ) {
   
  }
  ngOnChanges(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(){
    this.getMe();
    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ];
  //  this.dropdownSettings : IDropdownSettings = {};
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
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
   
      this.userService
        .getCorridorReport(this.organization,this.d1,this.d2)
        .subscribe((res) => {
          this.item = res;
          this.items= res;
          localStorage.setItem('defultDepartment', JSON.stringify(res));
        });
    }
  
  setDepartment(departmentName: any) {
  
    this.departments.find((visibleCompany: any) => {
      if (visibleCompany.name == departmentName) {
        this.invitationDepartment = visibleCompany.uuid;
      }
    });
    this.d1 = this.invitationDepartment;
    this.selectedDepartment = departmentName,
    //this.getUserReport();
    this.getCorridorReport();
    this.getCorridorDepartmentReport();
  }

  setDepartment2(departmentName:any) {
    this.departments.find((visibleCompany: any) => {
      if (visibleCompany.name == departmentName) {
        this.invitationDepartment = visibleCompany.uuid;
      }
    });
    this.d2 = this.invitationDepartment
    this.selectedDepartment2 = departmentName,
    this.getCorridorReport();
    this.getCorridorDepartmentReport();
  }

  compare(){
    this.showdata = true;
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
      .getCorridorEmployeeReport(this.organization, this.selectedEmployeeGroup)
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
