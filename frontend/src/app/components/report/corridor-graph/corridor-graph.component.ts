import { Component } from '@angular/core';
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
  constructor(
    private userService: UserService,
  ) {

  }

  ngOnInit() {
    this.userService.multiLinechart().subscribe((res) => {
    this.sphereList = res.sphere_list;
    for(let i = 0; i < res.final_list.length  ; i++){
      const newData = {
          label: res.final_list[i].question,
          data: res.final_list[i].points,
          backgroundColor: this.colour,
          borderColor: this.colour,
          fill: false,
          lineTension: 0,
          radius: 1,
      }
        this.dataset.push(newData)
      }
    let ctx: any = document.getElementById('lineChart') as HTMLElement;
    //var data= this.reportData;
    var data = {
      labels : res.sphere_list,
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
      var chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options,
      });
  })  
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

