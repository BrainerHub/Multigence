import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/services/user.service';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  user: any;
  data: any;
  corridorData: any;
  personsData: any;
  departments: any;
  organization:any;
  spheres = [
    '5221e658-3375-4f2c-9ffa-9832f450d9eb',
    'ceff5db8-ce45-40b4-b92e-560787a2b460',
    '10f814e8-397c-44e8-a93f-277e795179b8',
    'ee87e552-957f-4f44-a218-0b0086635c16',
    'fba50e11-ecc8-4a04-ba04-eddb6fa1b1e3',
    '4badfa9e-534c-4578-9bba-c4bfe9e33b94',
    '486091f1-d1ba-4ffa-9170-9d15df526fd1',
  ];
 
  constructor(
    private userService: UserService,
    public route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.generateCorridor();
    this.generatePersons('numPersons');
    this.getMe();
  }


  getMe() {
    this.userService.getMe().subscribe((res: any) => {
      this.user = res;
      this.organization = res.company;
      this.getOrganization()
    });
  }
  getOrganization() {
    this.userService.getOrganization(this.organization).subscribe((res) => {
    });
    
  }
  
  generateCorridor() {
    this.corridorData = this.generateRandomDataSet();
  }

  generatePersons(numPersons: any) {
    numPersons = numPersons || 5;

    this.personsData = {};
    for (var i = 0; i < numPersons; i++) {
      this.personsData['personName' + i] = this.generateRandomDataSet();
    }
  }

  generateRandomDataSet() {
    //var data = [];
    // for (var i = 0; i < this.spheres.length; i++) {
    //   data[i] = {};
    //   data[i].sphereId = spheres[i];
    //   data[i].totalPoints = Math.floor((Math.random() * 100) + 1);
    // }
    // return data;
  }

  random() {}
}
