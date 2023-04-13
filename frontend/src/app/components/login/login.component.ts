import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public _router: Router,
    private translate: TranslateService
  ) {}
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[aA-zZ0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: [null, Validators.required],
    });
  }
  get f() {
    return this.loginForm.controls;
  }

  //Submit login data
  
  login() {
    this.submitted = true;
    let data = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value,
    };
    this.userService.login(data).subscribe((response) => {      
      localStorage.setItem("authToken",response.token)
      this._router.navigate(['/admin']);
    });
  }


  
}
