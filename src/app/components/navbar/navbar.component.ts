import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthTokenService } from '@Services/auth-token/auth-token.service';
import { RoutingService } from '@Services/routing/routing.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  imports: [ButtonModule, TranslocoModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(
    protected routingService: RoutingService,
    protected authService: AuthTokenService,
  ) {}

  back(): void {
    this.routingService.navigateToLandingPage();
  }

  logout(): void {
    this.authService.logout();
    this.routingService.navigateToLogin();
  }
}
