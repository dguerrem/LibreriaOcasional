import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutentificacionService } from '../services/autentificacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;

  constructor(private router: Router, private autentificacionService: AutentificacionService) { }

  onLogin(event: Event) {
    event.preventDefault();

    // Mostrar Swal de carga mientras esperamos respuesta del backend
    Swal.fire({
      title: 'Comprobando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.autentificacionService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        alert('Inicio de sesión exitoso');
        localStorage.setItem('token', response.token); // Guardar token en localStorage
        window.location.href = '/inicio'; // Redirigir a la página de inicio
      },
      error: (_error) => {
        Swal.fire({
          title: 'Credenciales Incorrectas',
          icon: 'error',
          confirmButtonText: 'Reintentar',
          width: '350px'
        });
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
