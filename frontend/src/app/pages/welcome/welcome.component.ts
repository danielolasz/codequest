import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { lucideBatteryMedium, lucideFileClock, lucideGift, lucideTrophy, lucideUserCheck2 } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmH1Directive, HlmH2Directive, HlmH3Directive, HlmLargeDirective, HlmUlDirective } from '@spartan-ng/ui-typography-helm';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [HlmButtonDirective, HlmH1Directive, HlmH2Directive, HlmLargeDirective, HlmH3Directive, HlmUlDirective, HlmIconComponent, RouterLink],
  providers: [provideIcons({lucideFileClock, lucideBatteryMedium, lucideUserCheck2, lucideTrophy, lucideGift})],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {

}
