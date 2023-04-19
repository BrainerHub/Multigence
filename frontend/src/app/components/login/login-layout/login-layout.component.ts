import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss']
})
export class LoginLayoutComponent {
  selectedLanguage = "en"
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  changeLanguage(event: any) {
    const lang = event;
    this.selectedLanguage = event;
    this.translate.use(this.selectedLanguage );
   
  }
}
