import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {  Renderer2, ElementRef } from '@angular/core';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.scss']
})
export class LayoutHeaderComponent {

  toggle = true;
  status = 'Enable'; 
  isAdmin = false;
  isManager = false;
  selectedLanguage = "en"
  constructor(private translate: TranslateService, public router: Router, private userService : UserService,
    private renderer: Renderer2, private el: ElementRef) {
    translate?.setDefaultLang('en');
    translate.use('en');
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'dark-theme-selector');
  }



  ngOnInit() {
    this.getRole();
   
  }

  getRole(){
    this.userService.getMe().subscribe((user: any) => {
        if(user.role == 'MANAGER'){
         this.isManager = true;
        }else if(user.role == 'ADMIN'){
          this.isAdmin = true;
        }
    })
   }
 

  changeLanguage(event: any) {
    const lang = event;
    this.selectedLanguage = event;
    this.translate.use(this.selectedLanguage );
  }


  //user logout
    logOut(){
      localStorage.clear();
      this.router.navigate(['/login']); 
    }

    myValue(value:any){
      if (value === 'dark') {
        this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'dark-theme-selector');
        this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'white-theme-selector');
      } else {
        this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'dark-theme-selector');
        this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'white-theme-selector');
      }


    }
}
