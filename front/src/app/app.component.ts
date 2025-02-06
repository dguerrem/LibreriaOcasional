import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front';
  currentRoute: string = '';
  showNavbar: boolean = true;

  constructor(private router: Router, private toastr: ToastrService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url.replace('/', '');
        this.showNavbar = this.currentRoute !== '';
      }
    });
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('idUsuario') !== null;
  }

  // Función para cerrar sesión
  logout() {
    this.toastr.error('', '¡Hasta Pronto! 👋', {
      timeOut: 3000
    });
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('nombreCompleto');
    this.router.navigate(['/']);
  }
}
