import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LibreriaService {
    private apiUrl = 'https://libreriaocasional.onrender.com/getLibros';

    constructor(private http: HttpClient) { }

    getLibros(idUsuario: number): Observable<any> {
        const url = `${this.apiUrl}/${idUsuario}`;
        return this.http.get(url);
    }
}
