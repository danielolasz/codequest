import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmH1Directive, HlmH3Directive } from '@spartan-ng/ui-typography-helm';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [HlmCardModule, HlmButtonDirective, HlmInputDirective, HlmH3Directive, HlmH1Directive],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  isLogin = false;

  constructor(private router: Router) { }

  login() {
    this.router.navigateByUrl('/tickets');
  }

  signup() {

  }
}
