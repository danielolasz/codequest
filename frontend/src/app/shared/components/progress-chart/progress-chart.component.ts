import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  standalone: true,
  imports: [NgChartsModule],
  selector: 'app-progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss'],
})
export class ProgressChartComponent {
  chartData: ChartConfiguration['data'] = {
    labels: this.generateLabels(),
    datasets: [
      {
        label: 'Level',
        data: this.generateData(),
        borderColor: '#00cadc',
        backgroundColor: 'rgba(0, 202, 220, 0.5)',
      },
    ],
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Level' } },
    },
  };

  generateLabels() {
    const labels = [];
    const monthNames = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
    
    for (let i = 0; i < monthNames.length; i++) {
      labels.push(monthNames[i]);
    }
    
    return labels;
  }

  generateData() {
    return Array.from({ length: 365 }, () => Math.floor(Math.random() * 11));
  }

  updateChart() {
    this.chartData = {
      labels: this.generateLabels(),
      datasets: [
        {
          label: 'Level',
          data: this.generateData(),
          borderColor: '#00cadc',
          backgroundColor: 'rgba(0, 202, 220, 0.5)',
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Date' } },
        y: { title: { display: true, text: 'Level' } },
      },
    };
  }
}
