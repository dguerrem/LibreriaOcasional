import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LibreriaService {
    // private apiUrl = 'https://libreriaocasional.onrender.com/';
    private apiUrl = 'https://libreriaocasional.onrender.com/libros/';
    private epGetLibros = 'getLibros';
    private epAddLibro = 'addLibro';
    private epDeleteLibro = 'deleteLibro';

    constructor(private http: HttpClient) { }

    getLibros(idUsuario: number): Observable<any> {
        const url = `${this.apiUrl}${this.epGetLibros}/${idUsuario}`;
        return this.http.get(url);
    }

    addLibro(libro: any): Observable<any> {
        const url = `${this.apiUrl}${this.epAddLibro}`;
        return this.http.post(url, libro);
    }

    deleteLibro(idLibro: number): Observable<any> {
        const url = `${this.apiUrl}${this.epDeleteLibro}/${idLibro}`;
        return this.http.delete(url);
    }
}
