import { ChangeDetectorRef, Component, TemplateRef } from '@angular/core';
import { AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'app/services/user.service';
import { values } from 'lodash';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations: [
    trigger('rotateIcon', [
      state('rotated', style({ transform: 'rotate(-40deg)' })),
      state('normal', style({ transform: 'rotate(138deg)' })),
     
    ])
  ]
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
  ROLE_MANGER = 'MANAGER';
  send :boolean = false;
  selectedDepartment: any;
  selectedOption = false;
  department: any;
  iconState = 'normal';
  test : any
  selectedVersion: any

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    modalRef: BsModalRef,
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {
   
  }
  ngOnInit() {
    this.createCompanyForm = this.formBuilder.group({
      name: [null, Validators.required],
      trial: [null, Validators.required],
      invitations: [null, Validators.required],
    });
    this.getAll();
    this.getMe();
    this.createOrginationForm = this.formBuilder.group({
      organizations: this.formBuilder.array([]),
    });
   
  }
 
 getMe() {
  this.userService.getMe().subscribe((res: any) => {
    this.user = res;
    this.organization = res.company;
   this.getOrganization();
   this.organizations().push(this.newOrganization());
  
  });
}
  getAll() {
    this.userService.getOrganizations().subscribe((res) => {
      this.getAllOrgination = res;
      
    });
   
  }
  onChangeDepartment(event:any){
    this.selectedDepartment = event;
    }
  
  onSelect(event: any) {
    this.selectedOption = true;
  }
 
  onChangeVersion(event:any){
    this.selectedVersion = event;
    }

  getManagers(organization:any) {
    this.userService.getAllUsers({role:'MANAGER',organization:organization.uuid}).subscribe((managers) => {
      this.managers = managers;
    });
  }

  onInviteManager() {
    var data:any = {};
    const myArray = this.createOrginationForm.get('organizations') as FormArray;
    const firstItemValue = myArray.at(0).value; 
    data.email= firstItemValue.managerEmail;
    data.role = this.ROLE_MANGER;
    data.first_name =firstItemValue.managerName;
    data.last_name =firstItemValue.managerLastName;
    data.department =firstItemValue.department;
    data.uri = this._uri()
    this.userService.invite(data).subscribe((res) => {
   
      if(res.data['first_invitation']){
        this.send = false;
      }
    },
    (err) => {
      return err("Invitation of manager unsend... ")
    }
    ) }

  _uri(){
    var currentPath = window.location.href;
    var uri = window.location.href.concat('/accept');
    window.location.href.concat(currentPath);
    return uri;
  }


  getOrganization() {
    this.userService.getOrganization(this.organization).subscribe((res) => {});
  }

   organizations(): any {
    return this.createOrginationForm.get('organizations') as FormArray;
  }

  newOrganization(): any {
    this.visible = false;
    return this.formBuilder.group({
      name : [null,Validators.required],
      managerName:[null,Validators.required],
      managerLastName: [null,Validators.required],
      managerEmail: [null,Validators.required],
      department:[null,Validators.required]
    });
   
  }

  //onClick toggling
  onShowCreateCompany() {
    this.createCompany = !this.createCompany; //not equal to condition
    this.visible = !this.visible;
  }

   rotateIcon(data: any) {
    data.iconState = data.iconState === 'rotated' ? 'normal' : 'rotated';
    this.onCancelVisibleCompany('index', true)
  }

  saveAndOpenCompanyData() {
    if(this.createCompanyForm.controls['trial'].value === 'Full version' ||  this.createCompanyForm.controls['trial'].value === 'Vollversion'){
      let data = {
        name: this.createCompanyForm.controls['name'].value,
        trial: this.createCompanyForm.controls['trial'].value === 'Trial version' && 'Full version'
            ? true
            : false,
        managers: [{}],
      };
      this.userService.createOrganization(data).subscribe((res) => {
        this.userService.getOrganizations().subscribe((res) => {
          this.getAll();
        });
      });
    }
    else{
      let data = {
        name: this.createCompanyForm.controls['name'].value,
        trial: this.createCompanyForm.controls['trial'].value === 'Trial version' && 'Full version'
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
    }
   
    this.createCompanyForm.reset();
    this.visible = false;
  }

  saveNewCompanyName(newData: any) {
    this.createOrginationForm.value
    let data = {
      uuid : newData.uuid,
      name : this.createOrginationForm.value.organizations[0].name,
      departments : this.departments,
    };
     
    this.userService.updateOrganization(newData.uuid,data).subscribe((res) => {
   // this.getAll();
    })
   this.submitted = true;
  this.onCancelVisibleCompany('index', true)
   
  }
 
  onShowCompanyList(index: any, data: any) {
    this.visibleCompanyList = [];
    this.visibleCompanyList.push(data);
    if (this.activeIndex === data) {
      this.activeIndex = null;
    } else {  
      this.activeIndex = data;
      data.iconState = data.iconState === 'rotated' ? 'normal' : 'rotated';
    }
    this.userService.getDepartments(data.uuid).subscribe((res) => {
     this.departments = res.departments;
   
     
    })
  
    this.userService.getOrganizations().subscribe((res) => {
    this.updateAdminData = res ;
    });
    this.createOrginationForm.reset();
    this.getManagers(data);
  
   
  }

  onCancelCreateCompany() {
    this.submitted = false;
    this.createCompanyForm.reset();
    this.visible = false;
  }

  onCancelVisibleCompany(index: any, data: any ) {
  if(data === false){
    this.createOrginationForm.reset();
    this.visibleCompanyList = this.visibleCompanyList.filter(
      (visibleCompany: any) => visibleCompany != index
    );
    this.getAll();
  }else {
    this.visibleCompanyList = this.visibleCompanyList.filter(
      (visibleCompany: any) => visibleCompany != index
    );
    this.getAll();
  }
  }



  public trackByFn(index: number, data: any): any {
    return data.id; 
  }
  // trackByFn(index: number, data: any): any {
  //   return this.getAllOrgination ? this.getAllOrgination  : undefined
  // }
  
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

 
}
