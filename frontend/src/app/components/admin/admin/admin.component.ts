import { ChangeDetectorRef, Component, TemplateRef } from '@angular/core';
import { AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  activeIndex: any;
  text: any;
  createCompanyForm: FormGroup;
  createOrginationForm: FormGroup;
  submitted = false;
  createCompany: boolean = true;
  submitCompany: boolean = true;
  visible: boolean = false;
  organization: any = [];
  visibleCompanyList: any = [];
  getAllOrgination: any;
  departments: any;
  modalRef: BsModalRef<unknown>;
  updateAdminData:any;
  managers : any;
  user:any;
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    modalRef: BsModalRef,
    private modalService: BsModalService,
    private cd: ChangeDetectorRef
  ) {
    this.createOrginationForm = this.formBuilder.group({
      organizations: this.formBuilder.array([]),
    });
  }
  ngOnInit() {
    this.createCompanyForm = this.formBuilder.group({
      name: [null, Validators.required],
      trial: [null, Validators.required],
      invitations: [null, Validators.required],
    });
  

    this.getAll();
    this.getOrganization();
    this.getMe();
  }

getMe() {
  this.userService.getMe().subscribe((res: any) => {
    this.user = res;
    this.managers = res.role;
    this.organization = res.company;
  });
}
  getAll() {
    this.userService.getOrganizations().subscribe((res) => {
      this.getAllOrgination = res;
    });
   this.organizations().push(this.newOrganization());
  }

  getOrganization() {
    this.userService.getOrganization(this.organization).subscribe((res) => {});
  }

  organizations(): FormArray {
    return this.createOrginationForm.get('organizations') as FormArray;
  }

  newOrganization(): FormGroup {
    this.visible = false;
    return this.formBuilder.group({
      name : '',
      managerName: '',
      managerLastName: '',
      managerEmail: '',
    });
    
  }

  //onclick toggling
  onShowCreateCompany() {
    this.createCompany = !this.createCompany; //not equal to condition
    this.visible = !this.visible;
  }

  saveAndOpenCompanyData() {
    let data = {
      name: this.createCompanyForm.controls['name'].value,
      trial:
        this.createCompanyForm.controls['trial'].value === 'Trial version'
          ? true
          : false,
      invitations: this.createCompanyForm.controls['invitations'].value,
      managers: [{}],
    };

    this.userService.createOrganization(data).subscribe((res) => {
      this.userService.getOrganizations().subscribe((res) => {
        this.getAll();
      });
    });
    this.visible = false;
    //window.location.reload();
  }

  saveNewCompanyName(newData: any) {
    let data = {
      uuid : newData.uuid,
      name : this.createOrginationForm.value.organizations[0].name,
      departments : this.departments,
      managers: [],
    };
      
    this.userService.updateOrganization(newData.uuid,data).subscribe((res) => {
      this.getAll();

    })
    
    this.onCancelVisibleCompany('index')
  //  window.location.reload();
  }

  onCancelCreateCompany() {
    this.submitted = false;
    this.createCompanyForm.reset();
    this.visible = false;
  }

  onCancelVisibleCompany(index: any) {
    this.submitted = false;
    this.createCompanyForm.reset();
    this.visibleCompanyList = this.visibleCompanyList.filter(
      (visibleCompany: any) => visibleCompany != index
    );
  }

  onShowCompanyList(data: any) {
     this.visibleCompanyList.push(data);
    
    if (this.activeIndex === data) {
      this.activeIndex = null;
    } else {
      this.activeIndex = data;
    }
   
    this.userService.getDepartments(data.uuid).subscribe((res) => {
     this.departments = res.departments;
    })
   
      this.userService.getOrganizations().subscribe((res) => {
        this.updateAdminData = res ;
        
      });
  }


  trackByFn(index: number, data: any): any {
    return data.id; 
  }
  
  
  
  
  
  
  confirmDeleteDialog(id: any, index: any) {
    this.userService.deleteOrganization(id).subscribe((res) => {
      this.getAll();
      this.createCompanyForm.reset();
      this.visibleCompanyList = this.visibleCompanyList.filter(
        (visibleCompany: any) => visibleCompany != index
      );
      this.modalRef.hide();
    });
  }

  openConfirmationModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  declineDeleteModal(): void {
    this.modalRef.hide();
  }

  onInviteManager(data: any) {
    this.userService.invite(data).subscribe((res) => {});
  }
}
