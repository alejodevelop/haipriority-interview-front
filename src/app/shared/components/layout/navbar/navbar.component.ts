import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatDrawer, MatDrawerContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {FooterComponent} from "../footer/footer.component";
import {MatIconModule} from '@angular/material/icon';

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

  toggleDrawer(drawer: MatDrawer) {
    drawer.toggle();
    this.isExpanded = !this.isExpanded;
  }

}
