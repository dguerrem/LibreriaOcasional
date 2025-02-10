import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutentificacionService } from '../services/autentificacion.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private router: Router,
    private autentificacionService: AutentificacionService,
    private toastr: ToastrService
  ) {
    if (localStorage.getItem('idUsuario')) {
      this.router.navigate(['/inicio']);
    }
  }

  onLogin(event: Event) {
    event.preventDefault();

    Swal.fire({
      title: 'Comprobando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.autentificacionService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('idUsuario', response.idUsuario);
        localStorage.setItem('nombreCompleto', response.nombreCompleto);
        window.location.href = '/inicio';
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
