import { Component } from '@angular/core';
//nav
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatSidenavModule } from '@angular/material/sidenav';
//Button
import {MatButtonModule} from '@angular/material/button';
import{MatIconModule} from '@angular/material/icon';
//Links
import { RouterModule } from '@angular/router';

import {MatListModule} from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatIconModule,MatMenuModule, CommonModule, MatButtonModule,MatSidenavModule,MatListModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  title = "Titulo de prueba";


  openNotifications() {
    // Lógica para abrir las notificaciones
  }

  openAccessibility() {
    // Lógica para abrir accesibilidad
  }

  logout() {
    // Lógica para cerrar sesión
  }
}
