import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { SesionesService } from '../services/sesiones.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css',
})
export class CalendarioComponent {
  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  daysInCurrentMonth: any[] = [];
  emptyStartDays: any[] = [];
  readingSessions: any[] = [];
  selectedSession: any = null;
  loading = true;

  constructor(
    private sesionesService: SesionesService,
  ) { }


  ngOnInit() {
    this.cargarSesiones();
  }

  cargarSesiones() {
    this.loading = true;
    const idUsuario = Number(localStorage.getItem('idUsuario'));

    this.sesionesService.getLibros(idUsuario).subscribe({
      next: (response) => {
        this.readingSessions = response.map((sesion: any) => ({
          date: this.convertirFechaUTC(sesion.date),
          book: sesion.book,
          duration: sesion.duration,
          pages: sesion.pages,
          notes: sesion.notes || ''
        }));
        this.generarCalendario();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener sesiones de lectura:', error);
        this.loading = false;
      }
    });
  }

  generarCalendario() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const totalDays = lastDay.getDate();

    // Obtener el día de la semana (ajustando para que el lunes sea el primer día)
    const firstDayIndex = (firstDay.getDay() === 0) ? 6 : firstDay.getDay() - 1;
    this.emptyStartDays = new Array(firstDayIndex); // Ajusta el offset

    // Generar los días del mes
    this.daysInCurrentMonth = Array.from({ length: totalDays }, (_, i) => {
      const dayNumber = i + 1;
      const dateFormatted = new Date(this.currentYear, this.currentMonth, dayNumber).toISOString().split('T')[0];

      return {
        number: dayNumber,
        hasSession: this.readingSessions.some(session => session.date === dateFormatted),
        session: this.readingSessions.find(session => session.date === dateFormatted) || null
      };
    });
  }

  selectSession(day: any) {
    const session = day.session || null;
    debugger
    const formattedDate = this.formatDate(day.session?.date); // Se pasa la fecha sin sesión si no hay sesión

    this.selectedSession = {
      date: formattedDate,
      book: session?.book || null,
      duration: session?.duration || null,
      pages: session?.pages || null,
      notes: session?.notes || null
    };
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Sin sesión'; // Maneja el caso de días sin sesión

    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }

  closeSessionDetails() {
    this.selectedSession = null;
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generarCalendario();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generarCalendario();
  }

  convertirFechaUTC(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    return new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate())
      .toISOString().split('T')[0]; // Devuelve formato YYYY-MM-DD sin desfases
  }
}
