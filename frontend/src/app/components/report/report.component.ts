import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  IsVisible: boolean = false;
  visible: boolean = false;
  departments: any;
  organization:any =[];
  user: any;
  postions:any;
  submitted!: boolean;
  progressOrganaiztion:any;
  QuestionaryStatus:any;

  constructor(private userService: UserService,private formBuilder: FormBuilder,
    private translate: TranslateService,    
    public _router: Router,
   ){
   
  }



  ngOnInit(): void {
   
    this.getMe();
    
 }

 getMe() {
  this.userService.getMe().subscribe((res: any) => {
    this.user = res;
    this.organization = res.company;
    this.getDepartment();
    this.getPostions();
   // this.getOrganizationUsers();
    this.getInviteOrganization();
   this.getSpheres();
   this.getCorridorReport();
});
}

getDepartment() {
  this.userService.getDepartments(this.organization).subscribe(res => {
    console.log(res)
   var userDepartmentData = Array.from(Object.values(res));
   this.departments = userDepartmentData[0]
  })
 
}

getPostions(){
  this.userService.getPositions(this.organization).subscribe(res => {
   var userDepartmentData = Array.from(Object.values(res));
   this.postions = userDepartmentData[0]
  })
}

getStatus(){

}

// getOrganizationUsers(){
//   this.userService.getOrganizationUsers(this.organization,aa).subscribe(res =>{
//     var userDepartmentData = Array.from(Object.values(res));
//     this.progressOrganaiztion = userDepartmentData[0]
//   })
// }

getInviteOrganization(){
  this.userService.getInviteOrganization(this.organization).subscribe(res =>{
    var userDepartmentData = Array.from(Object.values(res));
    this.progressOrganaiztion = userDepartmentData[0]
  })
}

getSpheres(){
  this.userService.getSpheres().subscribe(res =>{
   
  })
}

getCorridorReport(){
  this.userService.getCorridorReport(this.organization).subscribe(res =>{
   
  })
}
}
