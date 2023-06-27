import { Component, Input } from '@angular/core';
import { UserService } from 'app/services/user.service';
import { Chart } from 'chart.js';
import { forEach } from 'lodash';

@Component({
  selector: 'app-corridor-graph',
  templateUrl: './corridor-graph.component.html',
  styleUrls: ['./corridor-graph.component.scss'],
})
export class CorridorGraphComponent {
  chart: any;
  sphereList:any;
  colour:any;
  dataset: Array<any> = [];
  organization: any = [];
  retrievedObject: any = [];
  user:any;
  departments: any;
  employee: any;
  selectedDepartment:any;
  invitationDepartment:any;
  employeesData:any;
  DefultDept:any =[];
  selectedDept:any = [];
  @Input() childItems: any[] = [];
  constructor(
    private userService: UserService,
  ) {
   
  }

  ngOnInit() {
   this.report();
  } 

report(){
  this.DefultDept = JSON.parse(localStorage.getItem('defultDepartment')|| '{}');
  //this.selectedDept = JSON.parse(localStorage.getItem('selectedDepartment')|| '{}');
 // console.log("---D-->",this.DefultDept)
 // console.log("--S--%%",this.selectedDept)
  this.userService.multiLinechart().subscribe((res) => {
  this.sphereList = res.sphere_list;
  console.log(this.selectedDept)
  if(this.selectedDept.length === 0){
    for(let i = 0; i < this.DefultDept.data?.length; i++){
      const newData = {
          label: "Defult",
          data: this.DefultDept.data[i].data.points,
          backgroundColor: this.colour,
          borderColor: this.colour,
          fill: false,
          lineTension: 0,
          radius: 1,     
      }
      this.dataset.push(newData)
    }
    for(let i = 0; i < this.DefultDept.users[0].data.points.length; i++){
      const newData = {
          label: this.DefultDept.users[0].data.points[i].question,
          data: this.DefultDept.users[0].data.points[i].point,
          backgroundColor: this.colour,
          borderColor: this.colour,
          fill: false,
          lineTension: 0,
          radius: 1,     
      }
        this.dataset.push(newData)
      }
  }else{
    for(let i = 0; i < this.selectedDept.data?.length; i++){
      const newData = {
          label: "selected",
          data: this.selectedDept.data[0].data.points,
          backgroundColor: this.colour,
          borderColor: this.colour,
          fill: false,
          lineTension: 0,
          radius: 1,     
      }
        this.dataset.push(newData)
    }
    // for(let i = 0; i < this.DefultDept.users[0].data.points.length; i++){
    //   const newData = {
    //       label: this.DefultDept.users[0].data.points[i].question,
    //       data: this.DefultDept.users[0].data.points[i].point,
    //       backgroundColor: this.colour,
    //       borderColor: this.colour,
    //       fill: false,
    //       lineTension: 0,
    //       radius: 1,     
    //   }
    //     this.dataset.push(newData)
    //   }
  } 
  let ctx: any = document.getElementById('lineChart') as HTMLElement;
  var test= res.sphere_list;
  var data = {
    labels :test,
    datasets: this.dataset
  };
    var options = {
      responsive: true,
      title: {
        display: true,
        position: 'top',
        text: 'Line Graph',
        fontSize: 18,
        fontColor: '#111',
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: '#333',
          fontSize: 16,
        },
      },
    };
    this.chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: options,
    });
})  
}
save(){

  this.chart.destroy();
  this.selectedDept = this.childItems;
  console.log("----***",this.selectedDept);
  this.report();
}


getMe() {
  this.userService.getMe().subscribe((res: any) => {
    this.user = res;
    this.organization = res.company;
      this.getUserReport();
  });
}

getUserReport() {
  this.userService.getUserReport(this.user.uuid).subscribe((res) => {});
}

setDepartment(department: any) {
  this.departments.find((visibleCompany: any) => {
    if (visibleCompany.name == department) {
      this.invitationDepartment = visibleCompany.uuid;
    }
  });
  (this.selectedDepartment = department), this.getUserReport();
    this.getCorridorDepartmentReport();
}

getCorridorDepartmentReport() {
  this.userService
    .getCorridorDepartmentReport(this.organization, this.invitationDepartment)
    .subscribe((res) => {
      this.employeesData = res.users;
      console.log("data---",this.employeesData);
    });
}

 getRandomColor2() {
  var length = 6;
  var chars = '0123456789ABCDEF';
  var hex = '#';
  while(length--) hex += chars[(Math.random() * 16) | 0];
  return hex;
}

getRandomColor() {
  this.colour = Math.floor(0x1000000 * Math.random()).toString(16);
  return '#' + ('000000' + this.colour).slice(-6);
}
  
}

