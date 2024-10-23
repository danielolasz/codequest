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
  styleUrl: './tickets.component.scss'
})
export class TicketsComponent implements OnInit {
  protected tickets: Ticket[] = [
    { title: 'Ticket 1', description: 'Description 1', date: '2020-01-01', user: 'User 1' },
    { title: 'Ticket 2', description: 'Description 2', date: '2020-01-02', user: 'User 2' },
    { title: 'Ticket 3', description: 'Description 3', date: '2020-01-03', user: 'User 3' },
    { title: 'Ticket 4', description: 'Description 4', date: '2020-01-04', user: 'User 4' },
    { title: 'Ticket 5', description: 'Description 5', date: '2020-01-05', user: 'User 5' },
    { title: 'Ticket 6', description: 'Description 6', date: '2020-01-06', user: 'User 6' },
    { title: 'Ticket 7', description: 'Description 7', date: '2020-01-07', user: 'User 7' },
    { title: 'Ticket 8', description: 'Description 8', date: '2020-01-08', user: 'User 8' },
    { title: 'Ticket 9', description: 'Description 9', date: '2020-01-09', user: 'User 9' },
    { title: 'Ticket 10', description: 'Description 10', date: '2020-01-10', user: 'User 10' },
    { title: 'Ticket 11', description: 'Description 11', date: '2020-01-11', user: 'User 11' },
    { title: 'Ticket 12', description: 'Description 12', date: '2020-01-12', user: 'User 12' },
    { title: 'Ticket 13', description: 'Description 13', date: '2020-01-13', user: 'User 13' },
    { title: 'Ticket 14', description: 'Description 14', date: '2020-01-14', user: 'User 14' },
    { title: 'Ticket 15', description: 'Description 15', date: '2020-01-15', user: 'User 15' },
    { title: 'Ticket 16', description: 'Description 16', date: '2020-01-16', user: 'User 16' },
    { title: 'Ticket 17', description: 'Description 17', date: '2020-01-17', user: 'User 17' },
  ];
  ticketsPerPage = 5;
  currentPage = 1;
  totalPages = 1;
  paginatedTickets: Ticket[] = [];

  ngOnInit(): void {
    this.updatePagination();
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
