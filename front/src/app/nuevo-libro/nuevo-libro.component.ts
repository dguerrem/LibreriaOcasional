import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EditorialesService } from '../services/editoriales.service';
import { EstadosService } from '../services/estados.service';
import { TapasService } from '../services/tapas.service';
import Swal from 'sweetalert2';
import { LibreriaService } from '../services/libros.service';

@Component({
  selector: 'app-nuevo-libro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-libro.component.html',
  styleUrl: './nuevo-libro.component.css'
})
export class NuevoLibroComponent {
  @Output() libroCreado = new EventEmitter<void>();

  book = this.initBook()

  editoriales: { IdEditorial: number; Nombre: string }[] = [];
  tapas: { IdTapa: number; Nombre: string }[] = [];
  estados: { IdEstado: number; Nombre: string }[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private editorialesService: EditorialesService,
    private estadosService: EstadosService,
    private tapasService: TapasService,
    private libreriaService: LibreriaService,
  ) { }

  initBook() {
    return {
      titulo: '',
      autor: '',
      editorial: '' as any,
      tapa: '',
      estado: '',
      progreso: null,
      puntuacion: null as any,
      fechaInicio: null as any,
      fechaFin: null as any,
      paginas: 0,
      precio: null,
      portadaFile: null as File | null,
      portadaPreview: null as SafeUrl | null,
    }
  }

  ngOnInit() {
    this.editorialesService.getEditoriales().subscribe({
      next: (data) => {
        this.editoriales = data;
      },
    });

    this.tapasService.getTapas().subscribe({
      next: (data) => {
        this.tapas = data;
      },
    });

    this.estadosService.getEstados().subscribe({
      next: (data) => {
        this.estados = data;
      },
    });
  }

  closePopup() {
    this.libroCreado.emit();
  }

  onSubmit() {
    Swal.fire({
      title: 'Registrando libro...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    if (this.faltanDatosPorCompletar()) {
      this.muestraSwalError('Faltan datos por completar antes de crear el libro.')
      return;
    }

    if (this.esPrecioErroneo()) {
      this.muestraSwalError('El precio no puede ser negativo.')
      return;
    }

    if (this.sonPaginasErroneas()) {
      this.muestraSwalError('Las páginas no pueden ser negativas.')
      return;
    }

    if (this.esEstadoEnProgreso()) { // En progreso
      if (this.esProgresoErroneo()) {
        this.muestraSwalError('El progreso de lectura no puede ser negativo ni mayor que el total de páginas.')
        return;
      }

      if (this.esFechaInicioNula()) {
        this.muestraSwalError('Si has comenzado el libro debes indicar una fecha de inicio.')
        return;
      }

      if (this.esFechaInicioErronea()) {
        this.muestraSwalError('La fecha de inicio no puede ser mayor al día de hoy.')
        return;
      }

      if (this.esProgresoNulo()) {
        this.muestraSwalError('Si has comenzado el libro debes indicar el progreso de lectura (Páginas leídas).')
        return;
      }
    }

    if (this.esEstadoCompletado()) { // Completado
      if (this.esPuntuacionNula()) {
        this.muestraSwalError('Debes indicar una puntuación')
        return;
      }

      if (this.esPuntuacionErronea()) {
        this.muestraSwalError('La puntuación debe estar entre 0 y 10.')
        return;
      }

      if (this.faltanFechasPorIndicar()) {
        this.muestraSwalError('Se debe indicar tanto la fecha de inicio como la fecha de finalización')
        return;
      }

      // Validación de fechas: Fecha inicio <= Fecha final
      if (this.esFechaInicioMayorFechaFin()) {
        this.muestraSwalError('La fecha de inicio no puede ser mayor que la fecha de finalización.')
        return;
      }
    }

    // Creación del objeto FormData
    const formData = new FormData();
    formData.append('titulo', this.book.titulo);
    formData.append('autor', this.book.autor);
    formData.append('editorial', this.book.editorial);
    formData.append('tapa', this.book.tapa);
    formData.append('estado', this.book.estado);
    formData.append('paginas', this.book.paginas.toString());
    formData.append('portada', this.book.portadaFile as File);
    formData.append('idUsuario', localStorage.getItem('idUsuario') as any);

    if (this.esEstadoEnProgreso()) {
      formData.append('progreso', this.book.progreso || '');
      formData.append('fechaInicio', this.book.fechaInicio || '');
      formData.append('precio', this.book.precio ? this.book.precio : '');
    }

    if (this.esEstadoCompletado()) {
      formData.append('puntuacion', this.book.puntuacion?.toString() || '');
      formData.append('progreso', this.book.paginas.toString());
      formData.append('fechaInicio', this.book.fechaInicio || '');
      formData.append('fechaFin', this.book.fechaFin || '');
      formData.append('precio', this.book.precio ? this.book.precio : '');
    }

    this.libreriaService.addLibro(formData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Libro creado',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.libroCreado.emit();
          this.closePopup();
        });
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo crear el libro. Inténtalo de nuevo.',
          icon: 'error'
        });
      }
    })
  }

  private muestraSwalError(errorMessage: string) {
    Swal.fire({
      title: 'Datos Erróneos',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Revisar'
    });
  }

  private faltanDatosPorCompletar() {
    return !this.book.titulo ||
      !this.book.autor ||
      !this.book.editorial ||
      !this.book.tapa ||
      !this.book.estado ||
      !this.book.precio ||
      !this.book.paginas ||
      !this.book.portadaPreview
  }

  getDiaActual() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    // Lista de tipos MIME permitidos
    const allowedTypes = [
      "image/png", "image/jpeg", "image/jpg", "image/gif",
      "image/webp", "image/heic", "image/heif"
    ];

    if (!allowedTypes.includes(file.type)) {
      this.muestraSwalError('Formato de imagen no permitido. Usa PNG, JPG, GIF, WEBP, HEIC o HEIF.');
      return;
    }

    this.book.portadaFile = file;
    // Convertimos la imagen en base64 para vista previa
    const reader = new FileReader();
    reader.onload = () => {
      this.book.portadaPreview = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }


  clearFile() {
    this.book.portadaPreview = '';
    this.book.portadaPreview = null; // Eliminamos la vista previa
  }

  triggerFileInput() {
    const input = document.getElementById('cover') as HTMLElement;
    input.click();
  }

  onEditorialChange(event: any) {
    if (event.target.value === "custom") {
      this.book.editorial = null;
    }
  }

  private esPrecioErroneo() {
    return this.book.precio !== null && this.book.precio < 0
  }

  private sonPaginasErroneas() {
    return this.book.paginas !== null && this.book.paginas < 0
  }

  private esProgresoErroneo() {
    return this.book.progreso !== null && (this.book.progreso < 0 || this.book.progreso > this.book.paginas)
  }

  private esPuntuacionErronea() {
    return (this.book.puntuacion < 0 || this.book.puntuacion > 10)
  }

  private esProgresoNulo() {
    return this.book.progreso === null
  }

  private esFechaInicioNula() {
    return this.book.fechaInicio === null
  }

  private esPuntuacionNula() {
    return this.book.puntuacion === null
  }

  private esFechaInicioErronea() {
    return this.book.fechaInicio > this.getDiaActual()
  }

  private esFechaInicioMayorFechaFin() {
    return new Date(this.book.fechaInicio) > new Date(this.book.fechaFin)
  }

  private faltanFechasPorIndicar() {
    return this.book.fechaInicio === null || this.book.fechaFin === null;
  }

  private esEstadoEnProgreso() {
    return this.book.estado === "1"
  }

  private esEstadoCompletado() {
    return this.book.estado === "2"
  }
}
