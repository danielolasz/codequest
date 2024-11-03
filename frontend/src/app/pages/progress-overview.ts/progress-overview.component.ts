import { Component, OnInit, ViewChild } from '@angular/core';
import { ProgressChartComponent } from '../../shared/components/progress-chart/progress-chart.component';

@Component({
  standalone: true,
  imports: [ProgressChartComponent],
  selector: 'app-progress-overview',
  templateUrl: './progress-overview.component.html',
  styleUrls: ['./progress-overview.component.scss'],
})
export class ProgressOverviewComponent implements OnInit {
  @ViewChild(ProgressChartComponent)
  progressChartComponent!: ProgressChartComponent;

  ngOnInit() {
    setTimeout(() => {
      this.progressChartComponent.generateData();
    });
  }
}
