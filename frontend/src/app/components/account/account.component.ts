import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  disableSwitching: true;
  activeTab = 'home';

  home(activeTab: any) {
    this.activeTab = activeTab;
  }

  profile(activeTab: any) {
    this.activeTab = activeTab;
  }
}
