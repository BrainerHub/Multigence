import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UserService } from 'app/services/user.service';
import { Chart } from 'chart.js';
import { forEach } from 'lodash';

@Component({
  selector: 'app-corridor-graph',
  templateUrl: './corridor-graph.component.html',
  styleUrls: ['./corridor-graph.component.scss'],
})
export class CorridorGraphComponent implements OnInit, OnChanges {
  chart: any;
  sphereList: any;
  colour: any;
  dataset: Array<any> = [];
  user: any;
  DefultDept: any = [];
  selectedDept: any = [];
  @Input() childItems: any;
  @Input() empData: any;
  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {

  }
  ngOnChanges(): void {
    this.dataset = [];
    if (this.chart) {
      this.chart.destroy();

    }
    this.report();
    this.cd.detectChanges();
  }

  ngOnInit() {
    // this.report();

  }

  report() {
    this.DefultDept = JSON.parse(localStorage.getItem('defultDepartment') || '{}')
    if (this.selectedDept.length === 0) {
      for (let i = 0; i < this.childItems?.data?.length; i++) {
        this.sphereList = this.childItems?.data[i].data.sphere_name
        const newData = {
          label: `Department_${i}`,
          data: this.childItems.data[i].data.points,
          backgroundColor: this.colour,
          borderColor: this.colour,
          fill: false,
          lineTension: 0,
          radius: 1,
        }
        this.dataset.push(newData)
      }
      if (this.empData?.length != 0) {
        if (this.empData?.length == 1){
          for (let i = 0; i < this.empData[0]?.data?.points?.length; i++) {
            const newData = {
              label: this.empData[0].data?.points[i].question,
              data: this.empData[0].data?.points[i].point,
              backgroundColor: this.colour,
              borderColor: this.colour,
              fill: false,
              lineTension: 0,
              radius: 1,
            }
            this.dataset.push(newData)
          }
        } else {
          this.empData.forEach((data: any) => {
            const newData = {
              label: data.first_name,
              data: data.data?.total_points,
              backgroundColor: this.colour,
              borderColor: this.colour,
              fill: false,
              lineTension: 0,
              radius: 1,
            }
            this.dataset.push(newData)
          });
        }
      }
    } 
    let ctx: any = document.getElementById('lineChart') as HTMLElement;
    // var test= res.sphere_list;
    var data = {
      labels: this.sphereList,
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
  }

  getRandomColor2() {
    var length = 6;
    var chars = '0123456789ABCDEF';
    var hex = '#';
    while (length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
  }

  getRandomColor() {
    this.colour = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + this.colour).slice(-6);
  }

}

