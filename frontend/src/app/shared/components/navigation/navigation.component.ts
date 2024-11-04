import { Component, OnInit } from '@angular/core';
import { lucideLogOut, lucideTicket, lucideUser, lucideStar, lucideLineChart } from '@ng-icons/lucide';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmIconModule, provideIcons } from '@spartan-ng/ui-icon-helm';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [HlmButtonModule, HlmIconModule, RouterLink, RouterLinkActive],
  providers: [provideIcons({ lucideLogOut, lucideTicket, lucideUser, lucideStar, lucideLineChart })],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  loggedInUser: User | undefined;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getUser();
  }

  logout(): void {
    this.authService.clearUser();
    this.router.navigateByUrl('/welcome');
  }

}
