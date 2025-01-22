import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {
  monthlyProgressData = [300, 450, 400, 600, 500, 700];
  yearlyProgressData = [2000, 3200, 4000, 4800, 5500];
  genreBreakdownData = {
    labels: ['Ficción', 'No Ficción', 'Ciencia Ficción', 'Misterio', 'Biografía'],
    datasets: [
      {
        data: [50, 35, 20, 15, 10],
        backgroundColor: ['#6c63ff', '#ff6f61', '#ffc371', '#5dd39e', '#73a5c6'],
      },
    ],
  };

  ngAfterViewInit() {
    this.createMonthlyProgressChart();
    this.createGenreBreakdownChart();
    this.createYearlyProgressChart();
    this.createRatingsChart();
  }

  createMonthlyProgressChart() {
    new Chart('monthlyProgressChart', {
      type: 'bar',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Páginas Leídas',
            data: this.monthlyProgressData,
            backgroundColor: '#6c63ff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: '#ffffff' },
          },
          y: {
            ticks: { color: '#ffffff' },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  createGenreBreakdownChart() {
    new Chart('genreBreakdownChart', {
      type: 'pie',
      data: this.genreBreakdownData,
      options: {
        indexAxis: 'y', // Apilar datos horizontalmente
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#ffffff' },
          },
        }
      },
    });
  }

  createYearlyProgressChart() {
    new Chart('yearlyProgressChart', {
      type: 'line',
      data: {
        labels: ['2019', '2020', '2021', '2022', '2023'],
        datasets: [
          {
            label: 'Progreso Anual (Páginas)',
            data: this.yearlyProgressData,
            borderColor: '#ff6f61',
            backgroundColor: 'rgba(255, 111, 97, 0.5)',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: '#ffffff' },
          },
          y: {
            ticks: { color: '#ffffff' },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  createRatingsChart() {
    new Chart('ratingsChart', {
      type: 'bar',
      data: {
        labels: ['Libro 1', 'Libro 2', 'Libro 3', 'Libro 4', 'Libro 5'],
        datasets: [
          {
            label: 'Nota',
            data: [4, 8, 2, 10, 8],
            backgroundColor: [
              '#6c63ff',
              '#ff6f61',
              '#ffc371',
              '#5dd39e',
              '#73a5c6',
            ],
            borderRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: '#ffffff' },
          },
          y: {
            beginAtZero: true,
            max: 10,
            ticks: { color: '#ffffff' },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

}
