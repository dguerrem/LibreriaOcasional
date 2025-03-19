import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CircleProgressOptions, NgCircleProgressModule } from 'ng-circle-progress';

import * as bootstrap from 'bootstrap';
import { CalendarioComponent } from "../calendario/calendario.component";
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SesionesService } from '../services/sesiones.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, NgCircleProgressModule, CalendarioComponent, FormsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  providers: [
    {
      provide: CircleProgressOptions,
      useValue: {
        radius: 60,
        outerStrokeWidth: 8,
        innerStrokeWidth: 4,
        outerStrokeColor: '#ff6f61',
        innerStrokeColor: '#f0f0f0',
        animationDuration: 300,
        animation: true,
      },
    },
  ],
})
export class InicioComponent {
  stats = [
    { title: 'Libros Leídos', value: 12, total: 20 },
    { title: 'Páginas Leídas', value: 3500, total: 5000 },
    { title: 'Nota Media', value: 4.2, total: 5 },
    { title: 'Libros En este Mes', value: 21, total: 30 },
  ];

  months = [
    { name: 'Enero', days: this.generateDays(31, [3, 10, 15, 27]) },
    { name: 'Febrero', days: this.generateDays(28, [2, 8, 20, 25]) },
    { name: 'Marzo', days: this.generateDays(31, [5, 12, 18, 30]) },
  ];

  popupAbierto = false;
  editarFecha = false;
  hoy = new Date().toISOString().split('T')[0]; // Fecha de hoy en formato YYYY-MM-DD

  nuevaSesion = {
    fecha: this.hoy,
    libro: '',
    duracion: null,
    paginasLeidas: null,
    notas: ''
  };

  constructor(
    private sesionesService: SesionesService,
  ) { }

  ngOnInit(): void {
    const carouselElement = document.querySelector('#tipsCarousel');
    if (carouselElement) {
      new bootstrap.Carousel(carouselElement, {
        interval: 4000,
        ride: 'carousel'
      });
    }
  }

  abrirPopup() {
    this.popupAbierto = true;
  }

  cerrarPopup() {
    this.popupAbierto = false;
    this.reiniciarFormulario();
  }

  toggleFecha() {
    this.editarFecha = !this.editarFecha;

    // Si se desactiva la edición, se resetea la fecha al día de hoy
    if (!this.editarFecha) {
      this.nuevaSesion.fecha = this.hoy;
    }
  }


  guardarSesion() {
    Swal.fire({
      title: 'Registrando sesión...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    if (!this.nuevaSesion.libro || !this.nuevaSesion.duracion || !this.nuevaSesion.paginasLeidas) {
      this.muestraSwalError('Faltan datos por completar antes de añadir la sesión.')
      return;
    }

    if (new Date(this.nuevaSesion.fecha) > new Date(this.hoy)) {
      this.muestraSwalError('No puedes seleccionar una fecha futura.')
      return;
    }

    const body = {
      fecha: this.nuevaSesion.fecha,
      libro: this.nuevaSesion.libro,
      duracion: this.nuevaSesion.duracion,
      paginasLeidas: this.nuevaSesion.paginasLeidas,
      notas: this.nuevaSesion.notas ? this.nuevaSesion.notas.trim() : null,
      idUsuario: localStorage.getItem('idUsuario')
    };

    this.sesionesService.addSesion(body).subscribe({
      next: () => {
        Swal.fire({
          title: 'Sesión añadida',
          text: `Se ha registrado la sesión de "${this.nuevaSesion.libro}".`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.cerrarPopup();
        });
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo añadir la sesión. Inténtalo de nuevo.',
          icon: 'error'
        });
      }
    });

  }

  reiniciarFormulario() {
    this.nuevaSesion = {
      fecha: this.hoy,
      libro: '',
      duracion: null,
      paginasLeidas: null,
      notas: ''
    };
    this.editarFecha = false;
  }

  recargarSesiones() {
    console.log('Recargando sesiones...');
    // Aquí puedes llamar al servicio que obtiene las sesiones actualizadas
  }

  private generateDays(totalDays: number, sessionDays: number[]) {
    return Array.from({ length: totalDays }, (_, i) => ({
      number: i + 1,
      hasSession: sessionDays.includes(i + 1),
    }));
  }

  private muestraSwalError(errorMessage: string) {
    Swal.fire({
      title: 'Datos Erróneos',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Revisar'
    });
  }
}
