import { Component, OnInit } from '@angular/core';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { Ticket } from '../../shared/models/ticket.model';
import { FormsModule } from '@angular/forms';
import { HlmSelectImports, HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { provideIcons } from '@ng-icons/core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';
import { ApiService } from '../../shared/api/api.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
  ],
  providers: [provideIcons({ lucideChevronRight, lucideChevronLeft })],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss',
})
export class TicketsComponent implements OnInit {
  ticketsPerPage = 5;
  currentPage = 1;
  totalPages = 1;
  paginatedTickets: Ticket[] = [];
  private subscription: Subscription | null = null;
  protected tickets: Ticket[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.updatePagination();

    this.subscription = interval(5000)
      .pipe(switchMap(() => this.apiService.get<Ticket[]>('tickets')))
      .subscribe((response) => {
        console.log(response);
        this.tickets = response;
        this.updatePagination();
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
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
}
