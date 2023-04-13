import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.service';
import { ConfirmPasswordValidator } from 'src/app/validators/confirm-password.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  submitted!: boolean;
  password: any;
  new_password: any;
  errormsg: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public _router: Router,
    private _translate: TranslateService
  ) {}
  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group(
      {
        password: [null, [Validators.required, Validators.minLength(6)]],
        new_password: [null, [Validators.required, Validators.minLength(6)]],
      },
      {
        validator: ConfirmPasswordValidator('password', 'new_password'),
      }
    );
  }



  changePassword() {
    this.submitted = true;
    let data = {
      new_password: this.changePasswordForm.controls['new_password'].value,
      token: true,
    };
    if (this.password === this.new_password) {
      this.userService.changePassword(data).subscribe(
        (res) => {
          this._router.navigate(['']);
        },
        (err) => {
          if (err.status == 409) {
            this.errormsg = this._translate.instant(
              'changePassword.form.error.passwordIsNotNew'
            );
          }else{
            this.errormsg =this._translate.instant('changePassword.form.error.passwordNotMatch');
          }
        }
      );
    }
    //   this.submitted = true;
    //   let data = {
    //     new_password: this.changePasswordForm .controls['new_password'].value,
    //     token:true
    //   };
    //   this.userService. changePassword(data).subscribe((response) => {
    //     console.log(response);

    //   });
  }
}
