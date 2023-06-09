import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BootstrapService } from 'app/services/bootstrap.service';
import { UserService } from 'app/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted!: boolean;
  user: any;
  userRole:any;
  errormsg:any ;
 
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public _router: Router,
    private translate: TranslateService,
    private bootstrapService:BootstrapService
  ) {}
  ngOnInit() {
    this.getMe();
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
    this.userService.login(data).subscribe( 

      (response) => {   
        
        // if(response.status == 500){
        //   this.errormsg = 'login.form.error.generic';
        // }                      
        localStorage.setItem("authToken",response.token)
        return this.bootstrapService.bootstrap();
      },
      (error) => {                           
        if(error.status == 400){
          this.errormsg = 'login.form.error.badcredentials';
        }
        else {
          this.errormsg = 'login.form.error.generic';
        }
      }

      );



    
    
  }


  getMe() {
    this.userService.getMe().subscribe((res: any) => {
      this.user = res;
      this.userRole = res.role;
  });
  }
  
}
