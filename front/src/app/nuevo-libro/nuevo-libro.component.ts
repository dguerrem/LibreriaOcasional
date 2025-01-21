import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


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
    fechaInicio: '',
    fechaFin: '',
    paginas: 0,
    portadaNombre: '', 
    portadaPreview: null as SafeUrl | null, // Para almacenar la vista previa de la imagen
  };

  constructor(private sanitizer: DomSanitizer) {}
  
  closePopup() {
    this.close.emit();
  }

  onSubmit() {
    console.log('Libro añadido:', this.book);
    this.closePopup();
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
    this.book.portadaNombre = file ? file.name : '';
  }
  
  clearFile() {
    this.book.portadaNombre = '';
    this.book.portadaPreview = null; // Eliminamos la vista previa
  }

  triggerFileInput() {
    const input = document.getElementById('cover') as HTMLElement;
    input.click();
  }
  
}
