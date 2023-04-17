import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent {
  username = '';
  isActive = 'account';

constructor(public router:Router){

}

onLogout(){
  localStorage.clear();
  this.router.navigate(['login']);
}
}
