import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PerfilService } from '../services/perfil.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule,],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  activeTab: string = 'datos';
  profileImage: string = '/assets/mock-avatar.png';
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  usuario: any = {};
  nombre: string = '';
  apellidos: string = '';
  fechaNacimiento: string = '';
  email: string = '';
  telefono: string = '';

  constructor(private perfilService: PerfilService) { }

  ngOnInit() {
    const idUsuario = localStorage.getItem('idUsuario');

    if (!idUsuario) return;

    this.perfilService.getUsuario(Number(idUsuario)).subscribe({
      next: (data) => {
        this.usuario = data;
        this.nombre = data.Nombre || '';
        this.apellidos = data.Apellidos || '';
        this.fechaNacimiento = data.FechaNacimiento || '';
        this.email = data.Email || '';
        this.telefono = data.Telefono || '';
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
