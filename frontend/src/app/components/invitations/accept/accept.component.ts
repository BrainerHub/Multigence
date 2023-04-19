import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { template } from 'lodash';
import { UserService } from 'app/services/user.service';
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
  constructor(private userService: UserService,private formBuilder: FormBuilder,private translate: TranslateService,
    private modalService: BsModalService,
    public _router: Router,){
   
  }
  ngOnInit(): void {
   this.createAccept();
   this.confirmOkDialog();
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
  
   openConfirmationModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md'});
  }

  confirmOkDialog(){
    this._router.navigate(['/login']);
    this.modalRef.hide();
}
 
}
