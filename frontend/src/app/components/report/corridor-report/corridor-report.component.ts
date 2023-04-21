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
  personListPage: any;
  IsVisible: boolean = false;
  titles: any;
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
  sortOrder = 'Closest';
  sortOrders = 'Furthest';
  isAscendingSort: boolean = false;
  userDescription = this.bootstrapService.getDescription;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
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
      this.getPostions();
      this.getOrganizationUsers();
      this.getInviteOrganization();
      this.getSpheres();
      this.getCorridorReport();
    });
  }
  getOrganizationUsers() {
    this.userService
      .getOrganizationUsers(this.organization, 'a')
      .subscribe((res) => {
        var usertitleData = res;
        this.employees = usertitleData.employees;
        this.users = usertitleData;
      });
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

  getPostions() {
    this.userService.getPositions(this.organization).subscribe((res) => {
      var userPositionData = Array.from(Object.values(res));
      this.titles = userPositionData[0];
      this.postions = userPositionData[0];
    });
  }

  getStatus() {}



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
    return this.user.sort((a:any, b:any) => {
      if (this.sortOrder === 'Closest') {
        return a - b;
      } else if(this.sortOrders === 'Furthest'){
        return a - b;
      } else{
         return b - a;
      }
    });
  }
  getpersonListPage(){
    this.sortOrder = this.sortOrder === 'Closest' ? 'Furthest' : 'Closest';
    this.sortOrders = this.sortOrders === 'Closest' ? 'Furthest' : 'Closest';
  
  }
  getCorridorReport() {
    this.userService
      .getCorridorReport(this.organization)
      .subscribe((res) => {
        this.personListPage = res.users;
      });
  }
}
