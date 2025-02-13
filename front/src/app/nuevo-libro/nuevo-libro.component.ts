import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EditorialesService } from '../services/editoriales.service';
import { EstadosService } from '../services/estados.service';
import { TapasService } from '../services/tapas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-libro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-libro.component.html',
  styleUrl: './nuevo-libro.component.css'
})
export class NuevoLibroComponent {
  @Output() close = new EventEmitter<void>();

  book = {
    titulo: '',
    autor: '',
    editorial: '' as any,
    tapa: '',
    estado: '',
    progreso: null,
    puntuacion: null,
    fechaInicio: null as any,
    fechaFin: null as any,
    paginas: 0,
    precio: null,
    portadaPreview: null as SafeUrl | null,
  };

  editoriales: { IdEditorial: number; Nombre: string }[] = [];
  tapas: { IdTapa: number; Nombre: string }[] = [];
  estados: { IdEstado: number; Nombre: string }[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private editorialesService: EditorialesService,
    private estadosService: EstadosService,
    private tapasService: TapasService,
  ) { }

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
    this.close.emit();
  }

  onSubmit() {
    // Validaciones básicas antes de enviar
    if (this.faltanDatosPorCompletar()) {
      Swal.fire({
        title: 'Datos Incompletos',
        text: 'Faltan datos por completar antes de crear el libro.',
        icon: 'error',
        confirmButtonText: 'Revisar'
      });
      return;
    }

    console.log(this.book);


    // TODO: CAMBIAR A METODOS EXTERNOS
    // this.revisarPrecio()
    // this.revisarPaginas()
    // etc.
    if (this.book.precio !== null && this.book.precio < 0) {
      Swal.fire({
        title: 'Datos Erróneos',
        text: 'El precio no puede ser negativo.',
        icon: 'error',
        confirmButtonText: 'Revisar'
      });
      return;
    }

    if (this.book.paginas !== null && this.book.paginas < 0) {
      Swal.fire({
        title: 'Datos Erróneos',
        text: 'Las páginas no pueden ser negativas.',
        icon: 'error',
        confirmButtonText: 'Revisar'
      });
      return;
    }

    if (this.book.estado === "1") { // En progreso
      if (this.book.progreso !== null && (this.book.progreso < 0 || this.book.progreso > this.book.paginas)) {
        Swal.fire({
          title: 'Datos Erróneos',
          text: 'El progreso de lectura no puede ser negativo ni mayor que el total de páginas.',
          icon: 'error',
          confirmButtonText: 'Revisar'
        });
        return;
      }

      if (this.book.fechaInicio === null) {
        Swal.fire({
          title: 'Datos Erróneos',
          text: 'Si has comenzado el libro debes indicar una fecha de inicio.',
          icon: 'error',
          confirmButtonText: 'Revisar'
        });
        return;
      }

      if (this.book.fechaInicio > this.getDiaActual()) {
        Swal.fire({
          title: 'Fecha Inválida',
          text: 'La fecha de inicio no puede ser mayor al día de hoy.',
          icon: 'error',
          confirmButtonText: 'Revisar'
        });
        return;
      }

      if (this.book.progreso === null) {
        Swal.fire({
          title: 'Datos Erróneos',
          text: 'Si has comenzado el libro debes indicar el progreso de lectura (Páginas leídas).',
          icon: 'error',
          confirmButtonText: 'Revisar'
        });
        return;
      }
    }

    if (this.book.estado === "2") { // Completado
      if (this.book.puntuacion === null) {
        Swal.fire({
          title: 'Datos Erróneos',
          text: 'Debes indicar una puntuación',
          icon: 'error',
          confirmButtonText: 'Revisar'
        });
        return;
      }

      // Validación de puntuación (0 - 10)
      if ((this.book.puntuacion < 0 || this.book.puntuacion > 10)) {
        Swal.fire({
          title: 'Datos Erróneos',
          text: 'La puntuación debe estar entre 0 y 10.',
          icon: 'error',
          confirmButtonText: 'Revisar'
        });
        return;
      }

      // Validación de fechas: Fecha inicio <= Fecha final
      if (this.book.fechaInicio && this.book.fechaFin && new Date(this.book.fechaInicio) > new Date(this.book.fechaFin)) {
        Swal.fire({
          title: 'Datos Erróneos',
          text: 'La fecha de inicio no puede ser mayor que la fecha de finalización.',
          icon: 'error',
          confirmButtonText: 'Revisar'
        });
        return;
      }
    }

    // Construcción del body con todas las restricciones y casuísticas
    const body: any = {
      titulo: this.book.titulo,
      autor: this.book.autor,
      editorial: this.book.editorial || null,
      tapa: this.book.tapa || null,
      estado: this.book.estado,
      precio: this.book.precio || null,
      paginas: this.book.paginas || null,
      portada: this.book.portadaPreview,
    };

    // Si el estado es "En progreso", se añade progreso de lectura
    if (this.book.estado === "1") {
      body.progreso = this.book.progreso || null;
    }

    // Si el estado es "Completado", se agregan puntuación y fecha de finalización
    if (this.book.estado === "2") {
      body.puntuacion = this.book.puntuacion || null;
      body.fechaFin = this.book.fechaFin || null;
    }

    if (this.book.estado !== "3") {
      body.fechaInicio = this.book.fechaInicio || null;
      body.precio = this.book.precio || null;
    }

    // Enviar el body a la API (Aún por implementar)
    console.log("Enviando datos del libro:", body);

    // TODO: DESCOMENTAR ESTA LINEA
    // this.closePopup();
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
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.book.portadaPreview = this.sanitizer.bypassSecurityTrustUrl(
          reader.result as string
        );
      };
      reader.readAsDataURL(file); // Convertimos la imagen en base64
    } else {
      this.book.portadaPreview = null; // Si no es imagen, no mostramos nada
    }
    this.book.portadaPreview = file ? file.name : '';
  }

  clearFile() {
    this.book.portadaPreview = '';
    this.book.portadaPreview = null; // Eliminamos la vista previa
  }

  triggerFileInput() {
    const input = document.getElementById('cover') as HTMLElement;
    input.click();
  }

  onEstadoChange() {
    if (this.book.estado !== 'En progreso') {
      this.book.progreso = null;
    }
    if (this.book.estado !== 'Completado') {
      this.book.puntuacion = null;
      this.book.fechaFin = null;
    }
  }

  onEditorialChange(event: any) {
    if (event.target.value === "custom") {
      this.book.editorial = null;
    }
  }

}
