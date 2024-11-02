import { Component, OnInit } from '@angular/core';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { Ticket } from '../../shared/models/ticket.model';
import { FormsModule } from '@angular/forms';
import { HlmSelectImports, HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { lucideChevronLeft, lucideChevronRight, lucideMoreVertical } from '@ng-icons/lucide';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import {
  HlmMenuModule,
} from '@spartan-ng/ui-menu-helm';
import { provideIcons } from '@ng-icons/core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';
import { ApiService } from '../../shared/api/api.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../shared/auth/auth.service';
import { User } from '../../shared/models/user.model';
import { Reward } from '../../shared/models/reward.model';
import { HlmDialogService } from '@spartan-ng/ui-dialog-helm';
import { RewardDialogComponent } from '../../shared/components/dialogs/reward-dialog/reward-dialog.component';
import { HlmSpinnerModule } from '@spartan-ng/ui-spinner-helm';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    HlmTableModule,
    FormsModule,
    BrnSelectImports,
    HlmSelectImports,
    HlmButtonModule,
    HlmIconComponent,
    HlmCardModule,
    HlmMenuModule,
    BrnMenuTriggerDirective,
    HlmSpinnerModule
  ],
  providers: [provideIcons({ lucideChevronRight, lucideChevronLeft, lucideMoreVertical })],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss',
})
export class TicketsComponent implements OnInit {
  ticketsPerPage = 5;
  currentPage = 1;
  totalPages = 1;
  paginatedTickets: Ticket[] = [];
  private subscriptions: Subscription[] = [];
  protected tickets: Ticket[] = [];
  protected users: User[] = [];
  protected selectedUser: User | null = null;

  loggedInUser: User | undefined;

  loadingTickets = false;
  loadingUsers = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private dialog: HlmDialogService,
  ) { }

  ngOnInit(): void {
    this.loadingTickets = true;
    this.loadingUsers = true;
    this.loggedInUser = this.authService.getUser();
    this.updatePagination();

    this.subscriptions.push(interval(5000)
      .pipe(switchMap(() => this.apiService.get<Ticket[]>('tickets')))
      .subscribe((response) => {
        console.log(response);
        console.log(this.loggedInUser);
        
        if (this.loggedInUser?.role === "developer") {
          for (const ticket of response) {
            if (ticket.user === this.loggedInUser) {
              this.tickets.push(ticket);
            }
          }
        } else {
          this.tickets = response;
        }
        this.updatePagination();
        this.loadingTickets = false;
      }));

    this.subscriptions.push(
      this.apiService.get<User[]>('users').subscribe((response) => {
        console.log(response);
        this.users = response;
        this.loadingUsers = false;
      })
    )
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => {
        sub.unsubscribe();
      });;
    }
  }

  updatePagination(): void {
    this.currentPage = 1;
    if (this.ticketsPerPage === this.tickets.length) {
      this.paginatedTickets = this.tickets;
      this.totalPages = 1;
    } else {
      this.totalPages = Math.ceil(this.tickets.length / this.ticketsPerPage);
      this.paginateTickets();
    }
  }

  paginateTickets(): void {
    const start = (this.currentPage - 1) * this.ticketsPerPage;
    const end = start + this.ticketsPerPage;

    this.paginatedTickets = this.tickets.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateTickets();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateTickets();
    }
  }

  openRewardModal(ticketId: number, userName: string): void {
    this.subscriptions.push(
      this.dialog.open(RewardDialogComponent, { context: { userName } })
        .closed$.subscribe((reward: number) => {
          if (reward) {
            console.log(`Rewarding ticket ${ticketId} with ${reward} points`);
            this.reward(ticketId, reward);
          }
        })
    );
  }

  reward(ticketId: number, reward: number): void {
    const newreward: Reward = {
      ticketId: ticketId,
      reward: reward,
      rewarded: new Date(),
      rewardedBy: this.loggedInUser as User
    }

    this.apiService.post<{ message: string }>('tickets/reward', newreward)
      .subscribe(response => {
        if (response && response.message) {
          console.log(response.message);
        }
      });
  }

  finishTicket(ticketId: number): void {
    this.apiService.post<{ message: string }>('tickets/finish', {ticketId})
      .subscribe(response => {
        if (response && response.message) {
          console.log(response.message);
        }
      });
  }

  reopenTicket(ticketId: number): void {
    this.apiService.post<{ message: string }>('tickets/reopen', {ticketId})
      .subscribe(response => {
        if (response && response.message) {
          console.log(response.message);
        }
      });
  }

  assignTicket(ticketId: number): void {
    if (!this.selectedUser) {
      return;
    }
    const user = this.selectedUser;
    this.apiService.post<{ message: string }>('tickets/assign', { ticketId, user })
      .subscribe(response => {
        if (response && response.message) {
          console.log(response.message);
        }
      });
  }
}
