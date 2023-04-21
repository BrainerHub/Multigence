import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/services/user.service';
// import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-data-load',
  templateUrl: './data-load.component.html',
  styleUrls: ['./data-load.component.scss'],
})
export class DataLoadComponent {
  messageHidden: boolean = false;
  errorMessageHidden: boolean = false;
  user: any;
  file: undefined;
  message: any;
  errorMessage: any;
  questionsFile: any;
  departments: any;
  organization: any = [];
  resp: any;
  constructor(private userService: UserService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.getMe();
  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  uploadFile() {
    this.userService.uploadQuestions(this.file).subscribe(
      (res: any) => {
        console.log(res,'res');
        
        if (res) {
          this.message = 'Data uploaded successfully!';
          this.messageHidden = true;
        }
        if (res && res.data && res.data.detail) {
        }
      },
      (err) => {
        err = 'Authentication credentials were not provided';
        this.errorMessage = err;
      }
    );

    this.errorMessageHidden = true;
  }

  getMe() {
    this.userService.getMe().subscribe((res: any) => {
      this.user = res;
      this.organization = res.company;
      this.getDepartment();
    });
  }
  getDepartment() {
    this.userService.getDepartments(this.organization).subscribe((res) => {
      var userDepartmentData = Array.from(Object.values(res));
      this.departments = userDepartmentData[0];
    });
  }
}
