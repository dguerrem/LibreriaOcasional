import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CircleProgressOptions, NgCircleProgressModule } from 'ng-circle-progress';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, NgCircleProgressModule],
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
}
