import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-libreria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './libreria.component.html',
  styleUrl: './libreria.component.css'
})
export class LibreriaComponent {
  books = [
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      status: 'Completed',
      rating: 5,
      progress: 100,
    },
    {
      title: '1984',
      author: 'George Orwell',
      status: 'In Progress',
      rating: 4,
      progress: 70,
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      status: 'Not Started',
      rating: 0,
      progress: 0,
    },
  ];

  startNewBook() {
    console.log('Starting a new book...');
  }
}
