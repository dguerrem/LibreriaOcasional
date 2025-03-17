import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NuevoLibroComponent } from '../nuevo-libro/nuevo-libro.component';
import { LibreriaService } from '../services/libros.service';
import Swal from 'sweetalert2';
import { EstadoLibroEnum } from '../../enums/estados.enum';

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

  EstadoLibro = EstadoLibroEnum

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

  eliminarLibro(idLibro: number, titulo: string) {
    // 1️⃣ Mostrar Swal de confirmación
    Swal.fire({
      title: `¿Eliminar "${titulo}"?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#bdbebf",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // 2️⃣ Mostrar Swal de carga mientras se elimina
        Swal.fire({
          title: "Eliminando libro...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // 3️⃣ Llamar al servicio de eliminación
        this.libreriaService.deleteLibro(idLibro).subscribe({
          next: () => {
            // 4️⃣ Mostrar Swal de éxito
            Swal.fire({
              title: "Libro eliminado",
              text: `"${titulo}" ha sido eliminado correctamente.`,
              icon: "success",
              confirmButtonText: "OK"
            }).then(() => {
              // 5️⃣ Recargar la lista de libros
              this.cerrarNuevoLibro();
            });
          },
          error: (error) => {
            console.error("Error al eliminar libro:", error);
            Swal.fire({
              title: "Error",
              text: "No se pudo eliminar el libro. Inténtalo de nuevo.",
              icon: "error"
            });
          }
        });
      }
    });
  }

  anyadirProgreso(idLibro: number) {
    console.log(idLibro);
    
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
