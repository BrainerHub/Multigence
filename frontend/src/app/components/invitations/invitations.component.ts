import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})
export class InvitationsComponent {
  [x: string]: any;
  createInvitationForm: FormGroup;
  CreateCandidateform: FormGroup;
  createInvitation: boolean = true;
  visible: boolean = false;
  IsVisible: boolean = false;
  candidateform: boolean = true;
  departments: any;
  organization:any =[];
  user: any;
  postions:any;
  submitted!: boolean;
  jobs: any
  inviteOrganaiztion:any;
  ROLE_EMPLOYEE = 'EMPLOYEE';
  ROLE_APPLICANT = 'APPLICANT';
  ROLE_MANGER = 'MANAGER';
  MAX_INVITATIONS_REACHED_ERROR_DESCRIPTION = 'Maximum number of invitations reached';

  INVITATION_SENT_MSG:any = 'invitation.sentMessage';
  INVITATION_SENT_BEFORE_MSG = 'invitation.sentBeforeMessage';
   USER_HAS_STARTED_QUIZ = 'invitation.userHasStartedQuizMessage';
   INVITATION_MAX_REACHED = 'invitation.maxReached';

  modalRef: BsModalRef<unknown>;
  constructor(private userService: UserService,private formBuilder: FormBuilder,
    private translate: TranslateService,    
    public _router: Router,
    private modalService: BsModalService){
   
  }



  ngOnInit(): void {
    this.getUser();
    this.getMe();
    this.creatInvitation();
    this.creatCandidate();
 }
 

 creatInvitation(){
  this.createInvitationForm = this.formBuilder.group({
    firstName:[null,Validators.required],
    lastName:[null,Validators.required],
    department:[null,Validators.required],
    createDepartament:[null,Validators.required],
    employeeEmail: [ null, [ Validators.required, Validators.pattern('^[aA-zZ0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
  });
 }

 creatCandidate(){
  this.CreateCandidateform = this.formBuilder.group({
    candidateFirstName:[null,Validators.required],
    candidateLastName:[null,Validators.required],
    department:[null,Validators.required],
    createDepartament:[null,Validators.required],
    job:[null,Validators.required],
    createJobId:[null,Validators.required],
    candidateEmail: [ null, [ Validators.required, Validators.pattern('^[aA-zZ0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
  });
 }
 
 get f() {
  return this.createInvitationForm.controls;
}

getUser(){
  this.userService.getUser().subscribe((res) => {
   
  })
}

getMe() {
  this.userService.getMe().subscribe((res: any) => {
    this.user = res;
    this.organization = res.company;
    this.getDepartment();
    this.getPostions();
    this.getInviteOrganization();
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

getInviteOrganization(){
  this.userService.getInviteOrganization(this.organization).subscribe(res =>{
    var userDepartmentData = Array.from(Object.values(res));
    this.inviteOrganaiztion = userDepartmentData[0]
  })
}



  onCancelInvitation(){

  }

  onShowInvitationForm(){
    this.createInvitation = !this.createInvitation; //not equal to condition
    this.visible = !this.visible;
  }
  onShowcandidateform(){
    this.candidateform = !this.candidateform; //not equal to condition
    this.IsVisible = !this.IsVisible;
  }
  saveAndOpencandidateData(){

  }
  
  resetForms() {

  }


   inviteEmployee() {
    var data:any = {};
    data.email= this.createInvitationForm.controls['candidateEmail'].value;
    data.role = this.ROLE_APPLICANT;
    data.first_name =this.createInvitationForm.controls['firstName'].value;
    data.last_name =this.createInvitationForm.controls['lastName'].value;
    data.department =this.createInvitationForm.controls['department'].value;
   
    data.uri = this._uri()
    this.userService.invite(data).subscribe((res) => {
     
      if(res.data['first_invitation']){
       // this.openConfirmationModal(this.INVITATION_SENT_MSG);
      }
      else {
       // _openInvitationSentModal(INVITATION_SENT_BEFORE_MSG);
      }
      this.resetForms();
    },
    (err) => {
      console.log("error....");
    }
    ) }

    inviteCandidate() {
      var data:any = {};
      data.email= this.CreateCandidateform.controls['employeeEmail'].value;
      data.role = this.ROLE_EMPLOYEE;
      data.first_name =this.CreateCandidateform.controls['candidateFirstName'].value;
      data.last_name =this.CreateCandidateform.controls['candidateLastName'].value;
      data.department =this.CreateCandidateform.controls['department'].value;
      data.job =this.CreateCandidateform.controls['job'].value;
      data.uri = this._uri()
      this.userService.invite(data).subscribe((res) => {
       
        if(res.data['first_invitation']){
         // this.openConfirmationModal(this.INVITATION_SENT_MSG);
        }
        else {
         // _openInvitationSentModal(INVITATION_SENT_BEFORE_MSG);
        }
        this.resetForms();
      },
      (err) => {
        console.log("error....");
      }
      ) }

    _uri(){
      var currentPath = window.location.href;
      var uri = window.location.href.concat('/accept');
      window.location.href.concat(currentPath);
      return uri;
    }

    openConfirmationModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, {class: 'modal-md'});
    }
   
    confirmOkDialog(){
      this._router.navigate(['/accept']);
      this.modalRef.hide();
  }
}
