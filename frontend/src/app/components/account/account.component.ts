import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  languageList: any;
  disableSwitching: true;
  activeTab = 'home';
  selectedValue: any
  ngOnInit() {
    this.languageList = ['Español', 'Inglés',];
   
  }
  home(activeTab: any) {
    this.activeTab = activeTab;
  }
  onChanges(event: any) {
    this.selectedValue = event;
  }
  profile(activeTab: any) {
    this.activeTab = activeTab;
  }
}
