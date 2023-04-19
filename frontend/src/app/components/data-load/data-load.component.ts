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
  hidden: boolean = false;
  user: any;
  file: any;
  message: any;
  errorMessage: any;
  questionsFile: any;
  departments: any;
  organization:any =[];
  resp: any;
  constructor(private userService: UserService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.getMe();
  }



  onChange(event: any) {
    this.file = event.target.files[0];
  }

  uploadFile(data:any) {
   
    this.userService.uploadQuestions(this.file).subscribe(
      (resp: any) => {
        this.message = 'Data uploaded successfully!';
      },
      (resp: any) => {
        if (resp && resp.data && resp.data.detail) {
          this.errorMessage = resp.data.detail;
        } else {
          this.errorMessage = 'Unexpected error';
        }
      }
    );

   
    this.hidden = true;
  }

  getMe() {
    this.userService.getMe().subscribe((res: any) => {
      this.user = res;
      this.organization = res.company;
      this.getDepartment();
    });
  }
  getDepartment() {
    this.userService.getDepartments(this.organization).subscribe(res => {
      var userDepartmentData = Array.from(Object.values(res));
      this.departments = userDepartmentData[0]
    })
   
  }
}
