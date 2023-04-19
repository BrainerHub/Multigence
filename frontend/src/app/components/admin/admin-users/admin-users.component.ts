import { Component, Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
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
  styleUrls: ['./admin-users.component.scss']
})
 

export class AdminUsersComponent {
  contentArray = new Array(90).fill('');
  returnedArray: string[];
  usersPage:any = [];
  usersList:any = [];
  sortDir = 1;
  organization: any = [];
  searchText: any;
  departments:any;
  usersFiltered : any;
  companyList:any = [];
  data:any;
  counters:any;
  user:any;
  modalRef: BsModalRef<unknown>;
  organizations:any;

//   filters = {
//     status: {
//       CREATED: false,
//       IN_PROGRESS:false,
//       DONE:false,
//     },
//     companyData:{
//       name :false
//     },
//     departmentData:{
//       name: false,
//     },
//    role:{
//     MANAGER: false,
//     EMPLOYEE: false,
//     APPLICANT:false
//   }
// };

// filters: any = {
//   status: {
//     CREATED: false,
//     IN_PROGRESS:false,
//     DONE:false
//   },
//   company: new Object(),
//   department: new Object(),
//   role: {
//     MANAGER: false,
//     EMPLOYEE: false,
//     APPLICANT:false
//   }
// };
statusList = ["CREATED", "IN_PROGRESS", "DONE"]
roleList = ["MANAGER", "EMPLOYEE", "APPLICANT"]
filters: any = {
  status: {},
  role: {},
  department: {},
  company: {}
}

  constructor(private userService: UserService, private modalService: BsModalService){
    this.sortTableName('first_name');
    this.sortTableName('last_name');
  }

  ngOnInit(): void {
    this.getUser();
 }

  getUser(){
    this.userService.getUser().subscribe((res) => {
      this.usersPage = res.map((x: any) => ({...x,  isChecked: false}));
      
      this.usersFiltered = this.usersPage;
      this._updateCounters();
      let companyMap = new Map();
      let departmentMap = new Map();
      this.usersPage.map((user: any)=>{
        companyMap.set(user.company.uuid, user.company);
        departmentMap.set(user.department.uuid, user.department);
      })
      this.companyList = [...companyMap.values()];
      this.departments = [...departmentMap.values()];
    })
   
  }

 

 _updateCounters() {
    var progressCounters = _.chain(this.usersPage).groupBy('status').mapValues(_.size).value();
    var companyCounters = _.chain(this.usersPage).groupBy(function(u){ if(!u.company){ return '' } return u.company.uuid; }).mapValues(_.size).value();
    var deparmentCounters = _.chain(this.usersPage).groupBy(function(u){ if(!u.department){ return '' } return u.department.uuid; }).mapValues(_.size).value();
    var roleCounters = _.chain(this.usersPage).groupBy('role').mapValues(_.size).value();

   this.counters = {
      progress: progressCounters,
      company: companyCounters,
      department: deparmentCounters,
      role: roleCounters
    };
   
  }

  onFilterSelect(property: any, filter: any){
    // console.log('property',property);
    // console.log('filter',filter);
    // Object.keys(property).map((key: any) => {
    //   let arr: Array<any> = Object.entries(property[key])
    //   arr.forEach((element) => {
    //     if (element[1]) {
    //         console.log(element,'elemnt');
    //         if(key == 'company' || key == 'department') {
             
              
              
    //         } else {
    //           console.log(key,'key');
    //           this.usersPage.filter((user: any) => console.log(user.uuid,'user')
    //           )
    //           console.log(element[0],'140');
    //         }
    //       }
    //   })
    // })
    Object.keys(this.filters).map((key:any) =>  {
      let arr: Array<any> = Object.entries(this.filters[key])
      arr.forEach(element => {
        if (element[1]){
         // console.log("--------element----------", element)
          if (key == 'company' || key == 'department'){
            this.usersPage = this.usersPage.filter((user:any) => {return user[key].uuid == element[0]})

          }else{
            // this.usersPage = this.usersPage.filter((user:any) => {return user[key] == element[0]})
        
           console.log(this.usersPage,'page');
           console.log(element[0]);
           
            if(element[0] == 'CREATED' || element[0] == 'DONE' ) {
                console.log(this.usersPage,'page');
              this.usersPage = this.usersPage.filter((user:any) => {return user[key] == element[0]})
            }
            // if(element[0] == 'IN_PROGRESS ') {
            //   //this.usersPage = this.usersPage.filter((user:any) => {return user[key] == 'IN_PROGRESS'})
            // }
            // if(element[0] == 'DONE')
            // this.usersPage = this.usersPage.filter((user:any) => {return console.log(user[key])})
            //this.usersPage = this.usersPage.filter((user:any) => {return user[key] == 'DONE'})
            //console.log(element[0],'el');
            
          }
        }
        this._updateCounters();

      });
  })
}
 
onChecked(event: any, value: any, filterBy: any){
  //  console.log("-------value------", value, filterBy)
  //  console.log(this.filters,'filter');
   
   
    this.usersPage = this.usersFiltered
    if (event.target.checked) {
      
      this.filters[filterBy][value] = true
    } else {
      this.filters[filterBy][value] = false
    }
    //const statusFilterd = this.onFilterSelect(this.filters.status, 'status')
   this.onFilterSelect(this.filters, 'status')
    
  }

  // onDepartmentSelect(event: any, value: any){
  // //  console.log("-------value------", value)
  //   if (event.target.checked) {
  //     this.filters.department[value] = true;
  //   } else {
  //     this.filters.department[value] = false;
  //   }
  //   this.onFilterSelect('department')
  // }



  
  progressFilter(event: any, progress: string) {
    const checked = event.target.checked
    
    if (checked ){
      this.usersPage = this.usersPage.filter((userobj: any) => progress == userobj.status);
    }else if(!checked ){
      // this.getUser();
    }
  }



  
  // get filteredUsersPage() {   
  //   if(!this.filters.status.CREATED && !this.filters.status.IN_PROGRESS && !this.filters.status.DONE) {
  //     return this.usersPage 
  //   }else if(!this.filters.status.CREATED && !this.filters.status.IN_PROGRESS && !this.filters.status.DONE && this.filters.companyData.name){
  //   return this.usersPage.filter((i:any) => i.company == (this.filters.companyData.name))
  //   }else if(!this.filters.status.CREATED && !this.filters.status.IN_PROGRESS && !this.filters.status.DONE && !this.filters.companyData.name && this.filters.departmentData.name){
  //     return this.usersPage.filter((i:any) => i.department == (this.filters.departmentData.name ? 'IT_department' : '') ||
  //     i.department == (this.filters.departmentData.name ? 'HR_department' : ''))
  //   } else if(this.filters.role.MANAGER && this.filters.role.EMPLOYEE && this.filters.role.APPLICANT) {
  //     return this.usersPage.filter((i:any) => i.role == (this.filters.role.MANAGER? 'MANAGER' : '') 
  //     || i.role == (this.filters.role.EMPLOYEE ? 'EMPLOYEE' : '') 
  //     || i.role == (this.filters.role.APPLICANT ? 'APPLICANT' : '')) 
  //   }

  //   else {
  //     return this.usersPage.filter((i:any) => i.status == (this.filters.status.CREATED ? 'CREATED' : '') 
  //     || i.status == (this.filters.status.IN_PROGRESS ? 'IN_PROGRESS' : '') 
  //     || i.status == (this.filters.status.DONE ? 'DONE' : '')) 
  //   }
    

    
  //  }

  // progressFilter(event: any, progress: string) {
    
  //   const checked = event.target.checked
  //   console.log("checked",checked);
    
  //   if (checked ){
      
  //     this.datats = this.usersPage.filter((userobj: any) => progress == userobj.status);
  //     this.usersPage = [];
  //   }else if(!checked ){
  //     this.datats = [];
     
  //     console.log("aaaa",this.usersPage);
  //     this.userService.getUser().subscribe((res) => {
  //       this.usersPage = res;
  //     })
  //   }
  // }


  onSortTableData(event:any) {
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
    this.usersPage.sort((a:any, b:any) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }

  openConfirmationModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md'});
  }

  confirmDeleteDialog(id:any){
    this.userService.deleteUser(id).subscribe((res)=>{
      
      this.modalRef.hide();
      })
}

  
  declineDeleteModal(): void {
    this.modalRef.hide();
  }

}


