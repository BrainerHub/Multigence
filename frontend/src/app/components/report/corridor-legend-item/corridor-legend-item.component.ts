import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from 'app/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { BootstrapService } from 'app/services/bootstrap.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-corridor-legend-item',
  templateUrl: './corridor-legend-item.component.html',
  styleUrls: ['./corridor-legend-item.component.scss'],
})
export class CorridorLegendItemComponent {
  user: any;
  organization: any;
  users: any;
  trial: any;
  progressOrganaiztion: any;
  summary: any;



  
  spheres: any;
  getSphereName: any;
  report: any;
  expanded: boolean = false;
  userPointsForSpheres: any;
  showCloseIcon = false;
  styleColor: any;
  individual = [];
  collective = [];
  userDataIndividual = '';
  userDataColective = '';

  page = 1
  expand: boolean =true;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    public _router: Router,
    private bootstrapService: BootstrapService
  ) {}

  ngOnInit(): void {
    this.getMe();
  }
 
  toggle() {
    this.expanded = !this.expanded;
  }
  deleteUser() {}

  changeColor(grey: any) {
    this.showCloseIcon = grey;
    if (grey) {
     this.styleColor = {'color':  'grey'};
    } else {
     this.styleColor = {'color':  this.user.color};
    }
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
    this.userService.getSpheres().subscribe((res) => {
      // this.userService.getAll().then(function(spheres:any){
      //   var groups = _.groupBy(spheres, 'type');
      //   return (groups['INDIVIDUAL'].concat(groups['NONE'])).concat(groups['COLLECTIVE']);
      // })
      // .then((spheres:any) => {
      //   spheres.forEach((sphere:any) => {
      //     var data = _.find(this.user.data, _byId(sphere.uuid));
       
      //     if(sphere.type === 'COLLECTIVE') {
      //      this.collective.push(totalPoints);  
      //     }
      //     else {
      //     this.individual.push(data.totalPoints); 
      //     }
      //   });
      // });
    });
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
function _byId(uuid: any): _.ListIteratorTypeGuard<unknown, unknown> {
  throw new Error('Function not implemented.');
}

