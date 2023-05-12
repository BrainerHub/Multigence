import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { lowerFirst } from 'lodash';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  editProfile: boolean = false;
  submitted!: boolean;
  userProfileForm!: FormGroup;
  user: any;
  userUpdateData: any;
  selectedDepartment: any;
  selectedGender: any;
  selectGender: any;
  data: any;
  departments: any;
  organization: any = [];
  invitationDepartment: any;
  genderList: ['Male', 'Female', 'Prefer not to say'];
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    public route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.genderList = ['Male', 'Female', 'Prefer not to say'];
    this.getMe();
    this.createForm();
  }

  createForm() {
    this.userProfileForm = this.formBuilder.group({
      first_name: [null],
      last_name: [null],
      title: [null],
      company: [null],
      gender: [null],
      department: [null],
      address: [null],
      zipcode: [null],
      state: [null],
      country: [null],
      telephone: [null],
      website: [null],
      description: [null],
    });
  }

  getMe() {
    this.userService.getMe().subscribe((res: any) => {
      this.user = res;
      this.organization = res.company;
      this.getDepartment();
    });
  }

  // onSelectDepartment(value: any) {
  //   this.selectedDepartment = value;
  // }
  saveProfile() {
    this.submitted = true;
    let data = {
      first_name: this.userProfileForm.controls['first_name'].value,
      last_name: this.userProfileForm.controls['last_name'].value,
      title: this.userProfileForm.controls['title'].value,
      department: this.invitationDepartment,
      gender: this.selectGender,
      address: this.userProfileForm.controls['address'].value,
      zipcode: this.userProfileForm.controls['zipcode'].value,
      state: this.userProfileForm.controls['state'].value,
      country: this.userProfileForm.controls['country'].value,
      telephone: this.userProfileForm.controls['telephone'].value,
      website: this.userProfileForm.controls['website'].value,
      description: this.userProfileForm.controls['description'].value,
    };
    this.userService.updateMe(data).subscribe((res: any) => {
      this.userUpdateData = res;
      this.getMe();
    });
    this.editProfile = true;
  }

  getDepartment() {
    this.userService.getDepartments(this.organization).subscribe((res) => {
      var userDepartmentData = Array.from(Object.values(res));
      this.departments = userDepartmentData[0];
    });
  }
  onChangeDepartment(event: any) {
    this.departments.find((visibleCompany: any) => {
      if (visibleCompany.name == event) {
        this.invitationDepartment = visibleCompany.name;
      }
    });
    this.selectedDepartment = event;
  }

  onChangeGender(event: any) {
    (visible: any) => {
      if (visible.name == event) {
        this.selectGender = visible.name;
      }
    };
    this.selectedGender = event;
  }
  openEdit() {
    this.userProfileForm.controls['title'].setValue(this.user.title);
    this.userProfileForm.controls['address'].setValue(this.user.address);
    this.userProfileForm.controls['zipcode'].setValue(this.user.zipcode);
    this.userProfileForm.controls['state'].setValue(this.user.state);
    this.userProfileForm.controls['country'].setValue(this.user.country);
    this.userProfileForm.controls['telephone'].setValue(this.user.telephone);
    this.userProfileForm.controls['website'].setValue(this.user.website);
    this.userProfileForm.controls['description'].setValue(
      this.user.description
    );
    this.editProfile = false;
  }
  closeEdit() {
    this.editProfile = false;
  }
}
