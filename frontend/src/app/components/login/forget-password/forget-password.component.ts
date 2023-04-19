import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'app/services/user.service';
// import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent {
  forgetPasswordForm!: FormGroup;
  submitted!: boolean;
  errormsg: any;

  constructor(
    private formBuilder: FormBuilder,
    public _router: Router,
    private userService: UserService,
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    this.forgetPasswordForm = this.formBuilder.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[aA-zZ0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
    });
  }

  get f() {
    return this.forgetPasswordForm.controls;
  }

  blurmsg() {
    this.errormsg = '';
  }

  sendEmailResetPassword() {
    const url: any = 'http://localhost:4200/#/reset-password/change';
    this.submitted = true;
    let data: any = {
      email: this.forgetPasswordForm.controls['email'].value,
      uri: url,
    };
    this.userService.sendEmailResetPassword(data).subscribe(
      (response) => {
        this._router.navigate(['']);
      },
      (err) => {
        this.errormsg = this._translate.instant(
          'forgotpassword.emailNotExists'
        );
      }
    );
  }
}
