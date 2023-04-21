import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from 'app/services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-questionary-report',
  templateUrl: './questionary-report.component.html',
  styleUrls: ['./questionary-report.component.scss'],
})
export class QuestionaryReportComponent {
  user: any;
  organization: any;
  users: any;
  trial: any;
  progressOrganaiztion: any;
  summary: any;
  spheres: any;
  getSphereName: any;
  report: any;
  userPointsForSpheres: any;
  constructor(
    private userService: UserService,
    private translate: TranslateService,
    public _router: Router,
  ) {}

  ngOnInit(): void {
    this.getMe();
  }

  getMe() {
    this.userService.getMe().subscribe((res: any) => {
      this.user = res;
      this.organization = res.company;
      this.getOrganizationUsers();
      this.getSpheres();
      this.getInviteOrganization();
    });
  }

  getSpheres() {
    this.userService.getSpheres().subscribe((res) => {});
  }

  getOrganizationUsers() {
    this.userService
      .getOrganizationUsers(this.organization, 'a')
      .subscribe((res) => {
        var usertitleData = Array.from(Object.values(res));
        this.users = usertitleData;
      });
  }
  getInviteOrganization() {
    this.userService
      .getInviteOrganization(this.organization)
      .subscribe((res) => {
        var userInviteData = Array.from(Object.values(res));
        this.trial = res.trial;
        this.progressOrganaiztion = userInviteData[0];
      });
  }
}
