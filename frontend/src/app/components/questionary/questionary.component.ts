import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { UserService } from 'src/app/services/user.service';
import { __param } from 'tslib';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from 'app/services/user.service';
@Component({
  selector: 'app-questionary',
  templateUrl: './questionary.component.html',
  styleUrls: ['./questionary.component.scss'],
})
export class QuestionaryComponent {
  optionsForm!: FormGroup;
  modalRef: BsModalRef<unknown>;
  user: any;
  data: any;
  departments: any;
  organization: any;
  current = 0;
  questionary = null;
  answers = [];
  completed: boolean = false;
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    modalRef: BsModalRef,
    private modalService: BsModalService,
    private userService: UserService,
    public route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.getMe();
  }

  availablePoints(values:any) {
    if (!this.questionary) {
      return 0;
    }
    return this.questionary['max_points'] - this.totalPoints(values);
  }

 totalPoints(values:any) {
    if(values === undefined) {
      values = this.answers;
    }
    return values.reduce(function(a:any, b:any) {
      return (a || 0) + (b || 0);
    }, 0);
  }
   increment() {
    // if(this.availablePoints() > 0) {
    //   this.answers[index] = (this.answers[index] || 0) + 1;
    // }
  }

 decrement() {
    // if(this.availablePoints() < vm.questionary['max_points']) {
    //  this.answers[index] = (this.answers[index] || 0) - 1;
    // }
  }
  getMe() {
    this.userService.getMe().subscribe((res: any) => {
      this.user = res;
      this.organization = res.company;
      this.getOrganization();
      this.getUserQuestionaries();
    });
  }
  getOrganization() {
    this.userService.getOrganization(this.organization).subscribe((res) => {});
  }

  getUserQuestionaries() {
    this.userService
      .getUserQuestionaries(this.organization)
      .subscribe((res) => {});
  }
  openConfirmationModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  declineModal(): void {
    this.modalRef.hide();
  }
  confirmStartDialog(){
      this.modalRef.hide();
}
next(){
  
}
}

