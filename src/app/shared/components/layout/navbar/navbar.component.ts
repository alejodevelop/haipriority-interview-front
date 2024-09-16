import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatDrawer, MatDrawerContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {FooterComponent} from "./footer/footer.component";
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from "../../../../auth/auth.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink,
    MatDrawerContainer,
    MatButton,
    MatSidenavModule,
    MatButtonModule,
    RouterOutlet,
    FooterComponent,
    MatIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isExpanded = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  toggleDrawer(drawer: MatDrawer) {
    drawer.toggle();
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }

}
