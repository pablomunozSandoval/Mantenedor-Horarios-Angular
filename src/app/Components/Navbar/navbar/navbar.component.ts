import { Component, OnInit } from '@angular/core';
// nav
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
// Button
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// Links
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    CommonModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  title = 'Mantenedor de Horarios';
  colaborador = 'Colaborador de Prueba';

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.colaborador = localStorage.getItem('colaborador') || '';
    }
  }

  openNotifications() {
    // Lógica para abrir las notificaciones
  }

  openAccessibility() {
    // Lógica para abrir accesibilidad
    console.log('Abrir accesibilidad');
  }

  logout() {
    // Lógica para cerrar sesión
    console.log('Cerrar sesión');
  }

  darkMode() {
    // Lógica para activar/desactivar el modo oscuro
    console.log('Modo oscuro activado');
  }

  decreaseFontSize() {
    // Lógica para disminuir el tamaño de la fuente
    console.log('Disminuir tamaño de letra');
  }

  increaseFontSize() {
    // Lógica para aumentar el tamaño de la fuente
    console.log('Aumentar tamaño de letra');
  }
}
