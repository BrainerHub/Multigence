import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-data-load',
  templateUrl: './data-load.component.html',
  styleUrls: ['./data-load.component.scss']
})
export class DataLoadComponent {
user: any;

  constructor(
    private userService: UserService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
   
    this.getMe();
  }

  getMe(){
    this.userService.getMe().subscribe((res: any) => {
      this.user = res;
    });
  }
}
