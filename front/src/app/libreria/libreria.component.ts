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
  loading = false;

  constructor(private libreriaService: LibreriaService) { }

  ngOnInit() {
    this.loading = true;
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
        this.loading = false;
      }
    });
  }

  abrirNuevoLibro() {
    this.estaNuevoLibroAbierto = true;
  }

  cerrarNuevoLibro() {
    this.loading = true;
    const idUsuario = localStorage.getItem('idUsuario');
    this.estaNuevoLibroAbierto = false;
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
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar los libros:', error);
        this.loading = false;
      }
    });
  }

getFullStars(rating: number): number {
  return Math.floor(rating); // Obtiene la parte entera (ej. 4 en 4.25)
}

getFractionalStar(rating: number): string | null {
  const decimal = rating % 1; // Obtiene solo la parte decimal (ej. 0.25 en 4.25)

  if (decimal >= 0.75) return 'bi bi-star-fill'; // ¾ de estrella o más → Estrella llena
  if (decimal >= 0.5) return 'bi bi-star-half'; // ½ estrella
  if (decimal >= 0.25) return 'bi bi-star-half'; // ¼ estrella (se usa la media estrella por compatibilidad)
  return null; // Si es menor de 0.25, no se muestra
}

getEmptyStars(rating: number): number {
  return 5 - Math.ceil(rating); // Calcula las estrellas vacías
}


}
