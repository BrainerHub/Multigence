import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { template } from 'lodash';
import { UserService } from 'app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-accept',
  templateUrl: './accept.component.html',
  styleUrls: ['./accept.component.scss']
})
export class AcceptComponent {
  Createacceptform: FormGroup;
  visible: boolean = false;
  IsVisible: boolean = false;
  modalRef: BsModalRef<unknown>;
  ERROR_PASSWORD_NOT_MATCH = 'form.passwordNotMatch';
  uid:any;
  user: any;
  password:any;
  invitationIsExpired:boolean = true;
  closeResult: string;
  @ViewChild('template') template: TemplateRef<HTMLDivElement>;
 
  
  constructor(private userService: UserService,private formBuilder: FormBuilder,private translate: TranslateService,
    private modalService: BsModalService,
    private _modalService: NgbModal,
    public _router: Router,){
   
  }
  ngOnInit(): void {
   this.createAccept();
    this.getMe( );
  
  }

  openModal() {
    this.modalRef = this.modalService.show(this.template, {
      animated: true,
      backdrop: 'static',
    });
  }
 

 
createAccept(){
    this.Createacceptform = this.formBuilder.group({
      email: [ null, [ Validators.required, Validators.pattern('^[aA-zZ0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      firstName:[null,Validators.required],
      lastName:[null,Validators.required],
      password:[null,Validators.required],
      repeatpass:[null,Validators.required],
      
    });
   }
  
   get f() {
    return this.Createacceptform.controls;
  }

  confirmOkDialog(){
    localStorage.clear();
    this._router.navigate(['/login']);
    this.modalRef.hide();
}
 
  getMe() {
    this.userService.getMe().subscribe((res: any) => {
      this.user = res;
      this.user.role = res.role ;
      this.uid = res.company;
      this.openModal();
  });
  }
  
  getInvitation(template: TemplateRef<any>) {
    this.userService.getInvitation(this.uid).subscribe(res =>{
      this.invitationIsExpired = false;
      this.user = res;
    this.openModal();
    },(error)=>{
      this.invitationIsExpired = true;
    })
   
  }
 
  join() {
    if(this.Createacceptform.controls['password'].value == this.Createacceptform.controls['repeatpass'].value){
      this.password = this.Createacceptform.controls['password'].value;
      this.userService.acceptInvitation(this.uid, this.password).subscribe(res =>{
        let data = {
          email: this.Createacceptform.controls['email'].value,
          password:this.Createacceptform.controls['password'].value,
        };
         return this.userService.login(data);
      })
    if(this.user.role == 'MANAGER'){
      this._router.navigate(['/invitations']);
    }
    else{
      this._router.navigate(['/questionary']);
    }
    }else{
       this.ERROR_PASSWORD_NOT_MATCH;
    }
  }
}
