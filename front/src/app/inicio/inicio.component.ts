import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CircleProgressOptions, NgCircleProgressModule } from 'ng-circle-progress';

import * as bootstrap from 'bootstrap';
import { CalendarioComponent } from "../calendario/calendario.component";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, NgCircleProgressModule, CalendarioComponent],
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

  ngOnInit(): void {
    const carouselElement = document.querySelector('#tipsCarousel');
    if (carouselElement) {
      new bootstrap.Carousel(carouselElement, {
        interval: 4000,
        ride: 'carousel'
      });
    }
  }


  private generateDays(totalDays: number, sessionDays: number[]) {
    return Array.from({ length: totalDays }, (_, i) => ({
      number: i + 1,
      hasSession: sessionDays.includes(i + 1),
    }));
  }
}
