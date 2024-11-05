import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProgressChartComponent } from '../../shared/components/progress-chart/progress-chart.component';
import { ApiService } from '../../shared/api/api.service';
import { AuthService } from '../../shared/auth/auth.service';
import { User } from '../../shared/models/user.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ProgressChartComponent],
  selector: 'app-progress-overview',
  templateUrl: './progress-overview.component.html',
  styleUrls: ['./progress-overview.component.scss'],
})
export class ProgressOverviewComponent implements OnInit, AfterViewInit {
  @ViewChild(ProgressChartComponent)
  progressChartComponent!: ProgressChartComponent;
  loggedInUser: User | undefined;
  private subscriptions: Subscription[] = [];
  protected users: User[] = [];
  selectedUserId: string | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.loggedInUser = this.authService.getUser();
    this.subscriptions.push(
      this.apiService.get<User[]>('users').subscribe((response) => {
        this.users = response;
        if (this.users.length > 0) {
          this.selectedUserId = this.users[0]._id;
        }
      }, error => {
        console.error('Error fetching users:', error);
      })
    )
  }

  ngAfterViewInit() {
    this.progressChartComponent.generateData();
  }

  onUserSelect() {
    this.progressChartComponent.updateChart();
  }
}
