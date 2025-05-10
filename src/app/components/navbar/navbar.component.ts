import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthTokenService } from '@Services/auth-token/auth-token.service';
import { RoutingService } from '@Services/routing/routing.service';
import { ButtonModule } from 'primeng/button';
import { SelectLanguageComponent } from '../select-language/select-language.component';

@Component({
  selector: 'app-navbar',
  imports: [ButtonModule, TranslocoModule, SelectLanguageComponent],
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
