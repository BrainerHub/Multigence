import {
  Component,
  Directive,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
// import { User } from 'src/app/models/user';
// import { UserService } from 'src/app/services/user.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import * as _ from 'lodash';
import { pluck } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent {
  contentArray = new Array(90).fill('');
  returnedArray: string[];
  usersPage: any = [];
  usersList: any = [];
  sortDir = 1;
  organization: any = [];
  searchText: any;
  departments: any;
  usersFiltered: any;
  companyList: any = [];
  data: any;
  counters: any;
  user: any;
  modalRef: BsModalRef<unknown>;
  organizations: any;
  finalArray: any[] = [];

  statusList = ['CREATED', 'IN_PROGRESS', 'DONE'];
  roleList = ['MANAGER', 'EMPLOYEE', 'APPLICANT'];
  filters: any = {
    status: [],
    role: [],
    department: [],
    company: [],
  };

  constructor(
    private userService: UserService,
    private modalService: BsModalService
  ) {
    this.sortTableName('first_name');
    this.sortTableName('last_name');
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.userService.getUser().subscribe((res) => {
      this.usersPage = res.map((x: any) => ({ ...x, isChecked: false }));

      this.usersFiltered = this.usersPage;
      this._updateCounters();
      let companyMap = new Map();
      let departmentMap = new Map();
      this.usersPage.map((user: any) => {
        companyMap.set(user.company.uuid, user.company);
        departmentMap.set(user.department.uuid, user.department);
      });
      this.companyList = [...companyMap.values()];
      this.departments = [...departmentMap.values()];
    });
  }

  _updateCounters() {
    var progressCounters = _.chain(this.usersPage)
      .groupBy('status')
      .mapValues(_.size)
      .value();
    var companyCounters = _.chain(this.usersPage)
      .groupBy(function (u) {
        if (!u.company) {
          return '';
        }
        return u.company.uuid;
      })
      .mapValues(_.size)
      .value();
    var deparmentCounters = _.chain(this.usersPage)
      .groupBy(function (u) {
        if (!u.department) {
          return '';
        }
        return u.department.uuid;
      })
      .mapValues(_.size)
      .value();
    var roleCounters = _.chain(this.usersPage)
      .groupBy('role')
      .mapValues(_.size)
      .value();

    this.counters = {
      progress: progressCounters,
      company: companyCounters,
      department: deparmentCounters,
      role: roleCounters,
    };
  }


  onChecked(event: any, value: any, filterBy: any) {
    this.usersPage = this.usersFiltered;
    // const users = this.usersFiltered; 
    // this.usersPage = []
    if (event.target.checked) {
      this.filters[filterBy].push(value);
    } else {
      this.filters[filterBy] = this.filters[filterBy].filter((item:any) => item != value);
    }

    this.usersPage = this.usersPage.filter((user: any) => ((this.filters['status'].length>0 ? this.filters['status'].includes(user['status']) : true) && (this.filters['department'].length>0 ? this.filters['department'].includes(user['department'].uuid) : true) && (this.filters['company'].length>0 ? this.filters['company'].includes(user['company'].uuid) : true) && (this.filters['role'].length>0 ? this.filters['role'].includes(user['role']) : true )));

    // users.forEach((user: any) => {
    //   if ((this.filters['status'].length>0 ? this.filters['status'].includes(user['status']) : true) && (this.filters['department'].length>0 ? this.filters['department'].includes(user['department'].uuid) : true) && (this.filters['company'].length>0 ? this.filters['company'].includes(user['company'].uuid) : true) && (this.filters['role'].length>0 ? this.filters['role'].includes(user['role']) : true) ){
    //     this.usersPage.push(user)
    //   }
    // });
  }
  

  progressFilter(event: any, progress: string) {
    const checked = event.target.checked;

    if (checked) {
      this.usersPage = this.usersPage.filter(
        (userobj: any) => progress == userobj.status
      );
    } else if (!checked) {
      // this.getUser();
    }
  }

  onSortTableData(event: any) {
    let target = event.currentTarget,
      classList = target.classList;

    if (classList.contains('fa-chevron-up')) {
      this.sortDir = -1;
    } else {
      this.sortDir = 1;
    }
    this.sortTableName('first_name');
    this.sortTableName('last_name');
  }

  sortTableName(colName: any) {
    this.usersPage.sort((a: any, b: any) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }

  openConfirmationModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  confirmDeleteDialog(id: any) {
    this.userService.deleteUser(id).subscribe((res) => {
      this.modalRef.hide();
    });
  }

  declineDeleteModal(): void {
    this.modalRef.hide();
  }
}
