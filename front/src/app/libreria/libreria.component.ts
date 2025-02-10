import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NuevoLibroComponent } from '../nuevo-libro/nuevo-libro.component';
import { LibreriaService } from '../services/libros.service';

@Component({
  selector: 'app-libreria',
  standalone: true,
  imports: [CommonModule, NuevoLibroComponent],
  templateUrl: './libreria.component.html',
  styleUrl: './libreria.component.css'
})
export class LibreriaComponent {
  estaNuevoLibroAbierto = false;
  books: any

  constructor(private libreriaService: LibreriaService) { }

  ngOnInit() {
    const idUsuario = localStorage.getItem('idUsuario');

    if (!idUsuario) return;

    this.libreriaService.getLibros(Number(idUsuario)).subscribe({
      next: (response) => {
        this.books = response.map((book: any) => ({
          id: book.IdLibro,
          title: book.NombreLibro,
          author: book.NombreAutor,
          cover: book.Portada,
          status: book.Estado,
          rating: book.Puntuacion,
          pages: book.Paginas ?? 0,
          progress: book.Progreso ?? 0,
          startDate: book.FechaInicio,
          endDate: book.FechaFin
        }));
      },
      error: (err) => {
        console.error('Error al obtener los libros', err);
      }
    });
  }

  abrirNuevoLibro() {
    this.estaNuevoLibroAbierto = true;
  }

  cerrarNuevoLibro() {
    this.estaNuevoLibroAbierto = false;
  }

  // Redondea hacia abajo el número de estrellas llenas
  getFullStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  // Determina si hay media estrella
  hasHalfStar(rating: number): boolean {
    return rating % 1 !== 0;
  }

  // Calcula las estrellas vacías restantes
  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.ceil(rating)).fill(0);
  }

}
