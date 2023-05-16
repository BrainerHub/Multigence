import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Renderer2, ElementRef } from '@angular/core';
import { UserService } from 'app/services/user.service';
import { distinctUntilChanged, interval, switchMap } from 'rxjs';
import { uid } from 'chart.js/dist/helpers/helpers.core';

@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.scss'],
})
export class LayoutHeaderComponent {
  toggle = true;
  status = 'Enable';
  isAdmin = false;
  isManager = false;
  selectedLanguage: any = 'en';
  currentTheme: any = 'dark';
  newValue: string = 'Initial Value';
  constructor(
    private translate: TranslateService,
    public router: Router,
    private userService: UserService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    translate?.setDefaultLang('en');
    translate.use('en');
    this.renderer.addClass(
      this.el.nativeElement.ownerDocument.body,
      'dark-theme-selector'
    );
  }

  ngOnInit() {
    this.getRole();
    this.currentTheme = localStorage.getItem('currentTheme');
    this.selectedLanguage = localStorage.getItem('selectedLanguage');
    this.translate.use(this.selectedLanguage);
    this.setTheme(this.currentTheme)
   
  }

  getRole() {
    this.userService.getMe().subscribe((user: any) => {
      if (user.role == 'MANAGER') {
        this.isManager = true;
      } else if (user.role == 'ADMIN') {
        this.isAdmin = true;
      }
    });
  }

  changeLanguage(event: any) {
    const lang = event;
    this.selectedLanguage = event;
    this.translate.use(this.selectedLanguage);
    localStorage.setItem('selectedLanguage', lang);
    this.userService.loadLang.next(lang)
   
     let lang1 = localStorage.getItem('selectedLanguage');
    let uId = localStorage.getItem('userId')
   // window.location.reload();
    this.userService.getUserQuestionaries(uId).subscribe((res)=>{
    this.userService.updateValues(res, lang1);
    })
  }


 
  logOut() {
    this.userService.logout();
  }

  setTheme(value: any) {
    if (value === 'dark') {
      this.renderer.addClass( this.el.nativeElement.ownerDocument.body,'dark-theme-selector');
      this.renderer.removeClass(this.el.nativeElement.ownerDocument.body,'white-theme-selector');
      this.currentTheme = 'dark';
    } else {
      this.renderer.removeClass(this.el.nativeElement.ownerDocument.body,'dark-theme-selector');
      this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'white-theme-selector');
      this.currentTheme = 'white';
    }
    localStorage.setItem('currentTheme', value)
  }

}
