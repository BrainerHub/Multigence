import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
// import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm!: FormGroup;
  submitted!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public _router: Router,
  ) {}
  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      first_name: [
        null,
          Validators.required,
          
      ],
      last_name: [null, Validators.required],
      company: [null, Validators.required],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[aA-zZ0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      additional_info:[null],
      acceptTerms: [null, Validators.required]
    });
  }
  get f() {
    return this.signupForm.controls;
  }
  signUp(){
    this.submitted = true;
    if (this.signupForm.invalid) {
    }
    let data = {
      first_name: this.signupForm.controls['first_name'].value,
      last_name: this.signupForm.controls['last_name'].value,
      company: this.signupForm.controls['company'].value,
      email: this.signupForm.controls['email'].value,
      additional_info: this.signupForm.controls['additional_info'].value,
    };
    this.userService.signUp(data).subscribe((res) => {
      this._router.navigate(['']);
    });
  }
}
