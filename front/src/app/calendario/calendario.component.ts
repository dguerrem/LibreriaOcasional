import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css',
})
export class CalendarioComponent {
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  emptyStartDays: any[] = [];

  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  readingSessions = [
    { date: '2025-01-05', book: 'El nombre del viento', duration: '45 minutos', pages: 35, notes: 'Narrativa cautivadora, personajes bien desarrollados.' },
    { date: '2025-01-12', book: 'Cien años de soledad', duration: '60 minutos', pages: 50, notes: 'Magia y realismo combinados de forma excepcional.' },
    { date: '2025-01-20', book: '1984', duration: '30 minutos', pages: 25, notes: 'Distopía impactante y reflexiva.' }
  ];

  getDaysInMonth(month: number, year: number) {
    const date = new Date(year, month, 1);
    let days = [];
  
    // Obtener el índice del primer día del mes (ajustado para que comience en lunes)
    let firstDayIndex = (date.getDay() + 6) % 7; 
  
    // Array de espacios vacíos para alinear correctamente el calendario
    this.emptyStartDays = Array(firstDayIndex).fill(null);
  
    while (date.getMonth() === month) {
      let formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      let session = this.readingSessions.find(session => session.date === formattedDate);
  
      days.push({
        number: date.getDate(),
        hasSession: !!session,
        sessionDetails: session || { hasSession: false }
      });
  
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
  
  

  daysInCurrentMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
  selectedSession: any = null;

  selectSession(day: any) {
    console.log("Sesión seleccionada:", day);
    this.selectedSession = day.sessionDetails;
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
    this.daysInCurrentMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.daysInCurrentMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
  }
}
