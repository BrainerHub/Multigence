import { Component } from '@angular/core';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-corridor-graph',
  templateUrl: './corridor-graph.component.html',
  styleUrls: ['./corridor-graph.component.scss'],
})
export class CorridorGraphComponent {
  chart: any;

  ngAfterViewInit() {
    let ctx: any = document.getElementById('lineChart') as HTMLElement;
    var data = {
      
      labels:   ['Interaction & Learning','Performance & Competition','Dominance & Stremgth','Tradition & Cohesion','Justice & Order','Community & Balance','Integrity & Sustainability'],
      datasets: [
        {
          label: 'Identity Foundation',
          data: [1,2,4,5,0,3,4],
          backgroundColor: 'blue',
          borderColor: 'lightblue',
          fill: false,
          lineTension: 0,
          radius: 1,
        },
        {
          label: 'Knowledge Source',
          data: [2,3,4,3,5, 6 ,4],
          backgroundColor: 'green',
          borderColor: 'lightgreen',
          fill: false,
          lineTension: 0,
          radius: 1,
        },
        {
          label: 'Work Attitude',
          data: [2,4,3,5,2,3,4],
          backgroundColor: 'pink',
          borderColor: 'lightpink',
          fill: false,
          lineTension: 0,
          radius: 1,
        },
        {
          label: 'Future Competence',
          data: [1,3,4,5,6,5,2],
          backgroundColor: 'red',
          borderColor: 'red',
          fill: false,
          lineTension: 0,
          radius: 1,
        }, {
          label: 'Future Instruments',
          data: [3,4,5,3,4,6,5],
          backgroundColor: 'yellow',
          borderColor: 'yellow',
          fill: false,
          lineTension: 0,
          radius: 1,
        },{
          label: 'Conflict Strategies',
          data: [2,3,4,5,6,4,3],
          backgroundColor: 'black',
          borderColor: 'black',
          fill: false,
          lineTension: 0,
          radius: 1,
        },
        {
          label: 'Leadership Roles',
          data: [3,4,5,5,6,4,3],
          backgroundColor: 'cyan',
          borderColor: 'cyan',
          fill: false,
          lineTension: 0,
          radius: 1,
        },
        {
          label: 'Management Instruments',
          data: [2,3,1,4,3,5,6],
          backgroundColor: 'lavender',
          borderColor: 'lavender',
          fill: false,
          lineTension: 0,
          radius: 1,
        },
        {
          label: 'Stress and Resilience',
          data: [0,2,4,5,5,6,4],
          backgroundColor: 'indigo',
          borderColor: 'indigo',
          fill: false,
          lineTension: 0,
          radius: 1,
        },
        {
          label: 'Average + Half-Deviation',
          data: [0,2,3,4,6,5,3],
          backgroundColor: 'purple',
          borderColor: 'purple',
          fill: false,
          lineTension: 0,
          radius: 1,
        },
        {
          label: 'Average Relative',
          data: [4,5,6,6,4,3,2],
          backgroundColor: 'orange',
          borderColor: 'orange',
          fill: false,
          lineTension: 0,
          radius: 1,
        },
        {
          label: 'Average + Half-Deviation',
          data: [2,3,5,4,5,6,2],
          backgroundColor: 'brown',
          borderColor: 'brown',
          fill: false,
          lineTension: 0,
          radius: 1,
        },
        

      ],
    };

    //options
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
  }
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  public mbarChartLabels: string[] = [
    'sphere6',
    'sphere7',
    'sphere5',
    'sphere4',
    'sphere1',
    'sphere2',
    'sphere3',
  ];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(105,159,177,0.2)',
      borderColor: 'rgba(105,159,177,1)',
      pointBackgroundColor: 'rgba(105,159,177,1)',
      pointBorderColor: '#fafafa',
      pointHoverBackgroundColor: '#fafafa',
      pointHoverBorderColor: 'rgba(105,159,177)',
    },
    {
      backgroundColor: 'rgba(77,20,96,0.3)',
      borderColor: 'rgba(77,20,96,1)',
      pointBackgroundColor: 'rgba(77,20,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,20,96,1)',
    },
  ];
  public barChartData: any[] = [
    { data: [55, 60, 75, 82, 56, 62, 80], label: '' },
  ];

  // events
  public chartClicked(e: any): void {
    
  }

  public chartHovered(e: any): void {
   
  }

  public randomize(): void {
    let data = [
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 100),
      Math.random() * 100,
      Math.round(Math.random() * 100),
      Math.random() * 100,
      Math.round(Math.random() * 100),
    ];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
  }
}
